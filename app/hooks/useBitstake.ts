import {
  graphProtocol,
  graphToken,
  bitStakeRegistry,
  ZERO_ADDRESS,
  oneInch,
  ETH_TOKEN,
  aaveProtocol,
  fundGatway,
  maticToken,
} from "../constants/contracts";
import { erc20Abi } from "../abi/erc20";
import { graphProtocolAbi } from "../abi/graphProtocolRegistry";
import { maticProtocolAbi } from "../abi/maticProtocol";
import { fundGatewaylAbi } from "../abi/fundGateway";
import { bitStakeRegistryABI } from "../abi/bitStakeRegistry";
import { oneInchRegistryABI } from "../abi/oneInchRegistry";
import { aaveProtocolABI } from "../abi/aaveProtocol";
import { userWalletRegistryAbi } from "../abi/userWalletRegistry";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppCommon } from "../contexts/AppCommon";
import { oneInchApi } from "../api/api";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../connectors";
import { BN } from "ethereumjs-util";
const abiDecoder = require("abi-decoder");
import { fromWei, formatDate } from "../util";

export enum StakingProtocol {
  GRAPH = "GRAPH",
  MATIC = "MATIC",
}
export interface GraphProtocolDelegation {
  indexer: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface AAVEBorrows {
  depositToken: string;
  depositAmt: string;
  borrowToken: string;
  borrowAmt: string;
  rateMode: number;
  blockTimestamp: string;
}

export interface Web3Event {
  name: string;
  events: { name: string; value: string }[];
}
export interface UserActionResponse {
  graphProtocolDelegation: GraphProtocolDelegation[];
  aaveBorrows: AAVEBorrows[];
}
import { sendTransaction, getTransactionHashes } from "../transactions/transactionUtils";

export const useBitstake = () => {
  const { account, chainId } = useWeb3React();
  const [onChainWalletAddress, setOnChainWalletAddress] = useState<string>("");
  const { setPageInactive, setPageInactiveReason, setPageLoading } = useContext(AppCommon);

  const onChainWalletAddressExists = useMemo(
    () => !!onChainWalletAddress && onChainWalletAddress !== ZERO_ADDRESS,
    [onChainWalletAddress]
  );

  const checkIfOnChainWalletExists = async () => {
    if (typeof window !== "undefined" && window.web3?.eth && account) {
      const bitStakeRegistryInstance = new window.web3.eth.Contract(
        bitStakeRegistryABI,
        bitStakeRegistry
      );
      const walletAddress = await bitStakeRegistryInstance.methods.proxies(account).call();
      setOnChainWalletAddress(walletAddress);
    }
  };

  useEffect(() => {
    if (injected.supportedChainIds?.includes(chainId || -1)) {
      setPageInactive?.(false);
      setPageInactiveReason?.("");
    } else {
      setPageInactive?.(true);
      setPageInactiveReason?.("Unsupported Network");
    }
  }, [chainId, account]);

  useEffect(() => {
    if (account) {
      checkIfOnChainWalletExists();
    }
  }, [account]);

  const delegate = useCallback(
    async (
      validatorId: string,
      amount: string,
      protocol: StakingProtocol = StakingProtocol.GRAPH
    ) => {
      if (typeof window !== "undefined" && account) {
        const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
        const maticInstance = new window.web3.eth.Contract(graphProtocolAbi, maticProtocolAbi);

        const erc20Address = protocol === StakingProtocol.GRAPH ? graphToken : maticToken;

        const erc20Instance = new window.web3.eth.Contract(erc20Abi, erc20Address);

        const allowances = await erc20Instance.methods
          .allowance(account, onChainWalletAddress)
          .call({ from: account });

        if (new BN(allowances).lt(new BN(amount))) {
          const approvalTx = erc20Instance.methods.approve(onChainWalletAddress, amount);

          const approvalEstimate = await approvalTx.estimateGas({ from: account });

          await sendTransaction(approvalTx, {
            from: account,
            gas: approvalEstimate,
          });
        }

        const fundGatewayInstance = await new window.web3.eth.Contract(fundGatewaylAbi, fundGatway);

        const depositEncodedData = fundGatewayInstance.methods
          .deposit(graphToken, amount)
          .encodeABI();

        let delegateData;

        if (protocol === StakingProtocol.GRAPH) {
          delegateData = graphInstance.methods
            .delegate(
              validatorId,
              amount,
              0 // getId
            )
            .encodeABI();
        } else {
          delegateData = maticInstance.methods
            .buyShare(
              validatorId,
              amount,
              0, // min share,
              0 // get id
            )
            .encodeABI();
        }

        const userWalletInstance = new window.web3.eth.Contract(
          userWalletRegistryAbi,
          onChainWalletAddress
        );

        const tx = userWalletInstance.methods.executeMulti(
          [fundGatway, graphProtocol],
          [depositEncodedData, delegateData],
          1,
          1
        );
        const estimatedGas = await tx.estimateGas({ from: account });

        await sendTransaction(tx, {
          from: account,
          gas: estimatedGas,
        });
      }
    },
    [account, onChainWalletAddress]
  );

  const deployOnChainWallet = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && account) {
        const bitStakeRegistryInstance = new window.web3.eth.Contract(
          bitStakeRegistryABI,
          bitStakeRegistry
        );

        const transaction = await bitStakeRegistryInstance.methods.build();
        const estimatedGas = await transaction.estimateGas({ from: account });

        setPageLoading?.(true);

        await sendTransaction(transaction, {
          from: account,
          gas: estimatedGas,
        });
        // await transaction.send({
        //   from: account,
        //   gas: estimatedGas,
        // });
        setPageLoading?.(false);

        await checkIfOnChainWalletExists();
      }
    } catch (e) {
      setPageLoading?.(false);
    }
  }, [account, checkIfOnChainWalletExists, setPageLoading]);

  const swapAndStake = useCallback(
    async (
      indexer: string,
      sourceToken: string,
      sourceTokenAmount: string,
      slippage: string = "1"
    ) => {
      const destinationToken = graphToken;
      if (sourceToken !== ETH_TOKEN) {
        const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);

        const approveTransaction = sourceTokenInstance.methods.approve(
          onChainWalletAddress,
          sourceTokenAmount
        );

        const gasForApproval = approveTransaction.estimateGas();

        await sendTransaction(approveTransaction, {
          from: account || "",
          gas: gasForApproval,
        });
      }

      const swapResponse = await oneInchApi.getSwapDetails(
        sourceToken,
        destinationToken,
        sourceTokenAmount,
        slippage,
        onChainWalletAddress
      );

      const userWalletInstance = new window.web3.eth.Contract(
        userWalletRegistryAbi,
        onChainWalletAddress
      );

      const oneInchProxy = new window.web3.eth.Contract(oneInchRegistryABI, oneInch);

      const swapAmount = swapResponse.data.toTokenAmount;
      const ethvalue = sourceToken === ETH_TOKEN ? sourceTokenAmount : 0;
      const swapTransactionEncodedData = oneInchProxy.methods
        .swap(
          sourceTokenAmount,
          sourceToken,
          destinationToken,
          swapResponse.data.tx.to,
          swapResponse.data.tx.data,
          ethvalue,
          0, // getId
          1 // setId
        )
        .encodeABI();

      const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
      const graphProtocolEncodedData = graphInstance.methods
        .delegate(
          indexer,
          new BN(swapAmount).mul(new BN(9)).div(new BN(10)).toString(), //"100971045019998194761",
          1 // getId
        )
        .encodeABI();

      const transaction = userWalletInstance.methods.executeMulti(
        [oneInch, graphProtocol],
        [swapTransactionEncodedData, graphProtocolEncodedData],
        1,
        1
      );
      const estimatedGas = await transaction.estimateGas({ from: account, value: ethvalue });

      setPageLoading?.(true);

      await sendTransaction(transaction, {
        from: account || "",
        gas: estimatedGas,
        value: ethvalue,
      });

      setPageLoading?.(false);
    },
    [account, onChainWalletAddress]
  );

  const borrowSwapAndStake = useCallback(
    async (
      indexer: string, //validator
      sourceToken: string, //deposit Token input dropdown
      destinationToken: string, //grt hardcoded
      depositAmount: string, //input
      borrowAmount: string, // calculate hardcoded for now
      borrowTokenAddress: string, // borrowId selected from table
      rateMode: string, // 1 or 2 radio
      slippage: string = "1"
    ) => {
      console.log({
        indexer,
        sourceToken,
        destinationToken,
        depositAmount,
        borrowAmount,
        borrowTokenAddress,
        rateMode,
        slippage,
      });
      if (sourceToken !== ETH_TOKEN) {
        const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);

        const approveTransaction = sourceTokenInstance.methods.approve(
          onChainWalletAddress,
          depositAmount
        );

        const gasForApproval = approveTransaction.estimateGas();

        await sendTransaction(approveTransaction, {
          from: account || "",
          gas: gasForApproval,
        });
      }

      const aaveInstance = new window.web3.eth.Contract(aaveProtocolABI, aaveProtocol);

      const aaveDepositAndBorrowEncodedData = aaveInstance.methods
        .depositAndBorrow(
          sourceToken,
          borrowTokenAddress,
          depositAmount,
          borrowAmount,
          rateMode,
          0,
          1 // setId
        )
        .encodeABI();

      const swapResponse = await oneInchApi.getSwapDetails(
        borrowTokenAddress,
        destinationToken,
        borrowAmount,
        slippage,
        onChainWalletAddress
      );

      const userWalletInstance = new window.web3.eth.Contract(
        userWalletRegistryAbi,
        onChainWalletAddress
      );

      const oneInchProxy = new window.web3.eth.Contract(oneInchRegistryABI, oneInch);

      const swapAmount = swapResponse.data.toTokenAmount;
      const ethvalue = sourceToken === ETH_TOKEN ? depositAmount : 0;
      const swapTransactionEncodedData = oneInchProxy.methods
        .swap(
          borrowAmount,
          borrowTokenAddress,
          destinationToken,
          swapResponse.data.tx.to,
          swapResponse.data.tx.data,
          0,
          1, // getId
          1 // setId
        )
        .encodeABI();

      const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
      const graphProtocolEncodedData = graphInstance.methods
        .delegate(
          indexer,
          swapAmount,
          1 // getId
        )
        .encodeABI();

      const transaction = userWalletInstance.methods.executeMulti(
        [aaveProtocol, oneInch, graphProtocol],
        [aaveDepositAndBorrowEncodedData, swapTransactionEncodedData, graphProtocolEncodedData],
        1,
        1
      );

      const estimatedGas = await transaction.estimateGas({ from: account, value: ethvalue });

      setPageLoading?.(true);

      await sendTransaction(transaction, {
        from: account || "",
        gas: estimatedGas,
        value: ethvalue
      });
      setPageLoading?.(false);
    },
    [account, onChainWalletAddress]
  );

  // It will be called whenever user changes amount in the field in `swap and stake` tab.
  const getEstimatedSwapAmount = useCallback(
    async (
      sourceToken: string,
      destinationToken: string,
      swapAmount: string,
      slippage: string = "1"
    ) => {
      const swapResponse = await oneInchApi.getEstimatedSwapDetails(
        sourceToken,
        destinationToken,
        swapAmount,
        slippage,
        onChainWalletAddress
      );

      return swapResponse.data.toTokenAmount;
    },
    [onChainWalletAddress]
  );

  const getTokenBalance = useCallback(
    async (tokenAddress: string) => {
      if (tokenAddress === ETH_TOKEN) {
        return window.web3.eth.getBalance(account);
      } else {
        const erc20Instance = new window.web3.eth.Contract(erc20Abi, tokenAddress);
        return erc20Instance.methods.balanceOf(account).call();
      }
    },
    [account]
  );

  const getUserActions = async (): Promise<UserActionResponse> => {
    if (account) {
      const txHashes = getTransactionHashes(account);

      const receiptPromises = await txHashes.map((tx: string) =>
        window.web3.eth.getTransactionReceipt(tx)
      );

      const receipts = await Promise.all(receiptPromises);

      abiDecoder.addABI(erc20Abi);
      abiDecoder.addABI(aaveProtocolABI);
      abiDecoder.addABI(userWalletRegistryAbi);
      abiDecoder.addABI(fundGatewaylAbi);
      abiDecoder.addABI(graphProtocolAbi);

      const graphDelegation: GraphProtocolDelegation[] = [];
      const aaveBorrows: AAVEBorrows[] = [];

      for (let i = 0; i < receipts.length; i++) {
        if (!receipts[i]) {
          continue;
        }

        const block = await window.web3.eth.getBlock(receipts[i].blockNumber);
        const decodedReceipt = abiDecoder.decodeLogs(receipts[i].logs);
        decodedReceipt
          .filter(
            (dr: { name: string }) => dr.name == "GraphProtocolDelegated" || dr.name === "Borrow"
          )
          .forEach((event: Web3Event) => {
            if (event.name === "GraphProtocolDelegated") {
              graphDelegation.push({
                indexer: event.events[0].value,
                amount: `${parseFloat(fromWei(event.events[1].value)).toFixed(2)} GRT`,
                blockNumber: receipts[i].blockNumber,
                blockTimestamp: formatDate(block.timestamp),
              });
            }
            if (event.name === "Borrow") {
              aaveBorrows.push({
                depositToken: event.events[0].value,
                depositAmt: event.events[1].value,
                borrowToken: event.events[2].value,
                borrowAmt: event.events[3].value,
                rateMode: parseInt(event.events[4].value),
                blockTimestamp: formatDate(block.timestamp),
              });
            }
          });

        // graphDelegation.push(...graphProtocolEvents);
      }
      console.log('aaveBorrows  :', aaveBorrows);
      return {
        graphProtocolDelegation: graphDelegation,
        aaveBorrows,
      };
    }
    return {
      graphProtocolDelegation: [],
      aaveBorrows: [],
    };
  };

  return {
    delegate,
    onChainWalletAddress,
    onChainWalletAddressExists,
    deployOnChainWallet,
    swapAndStake,
    getEstimatedSwapAmount,
    getTokenBalance,
    borrowSwapAndStake,
    getUserActions,
  };
};
