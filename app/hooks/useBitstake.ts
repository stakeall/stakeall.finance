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
  maticProtocol,
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
import { fromWei, formatDate, getTokenByProtocol } from "../util";

export enum StakingProtocol {
  GRAPH = "GRAPH",
  MATIC = "MATIC",
  LIVEPEER = "LIVEPEER",
  NUCYPHER = "NUCYPHER",
}
export interface GraphProtocolDelegation {
  indexer: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface MaticProtocolDelegation {
  validator: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
}
export interface AAVEBorrows {
  depositToken: string;
  depositAmt: string;
  borrowToken: string;
  borrowAmt: string;
  rateMode: string;
  blockTimestamp: string;
}

export interface Web3Event {
  name: string;
  events: { name: string; value: string }[];
}
export interface UserActionResponse {
  graphProtocolDelegation: GraphProtocolDelegation[];
  aaveBorrows: AAVEBorrows[];
  maticProtocolDelegation: MaticProtocolDelegation[];
}
import { sendTransaction, getTransactionHashes } from "../transactions/transactionUtils";
import { contractMap } from "../constants/contractMap";

export const useBitstake = () => {
  const { account, chainId } = useWeb3React();
  const [onChainWalletAddress, setOnChainWalletAddress] = useState<string>("");
  const { setPageInactive, setPageInactiveReason, setPageLoading, protocol } =
    useContext(AppCommon);

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
        try {
          setPageLoading?.('Submitting Transaction....');
          const protocolToken = getTokenByProtocol(protocol);
          const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
          const maticInstance = new window.web3.eth.Contract(maticProtocolAbi, maticProtocol);
          const erc20Instance = new window.web3.eth.Contract(erc20Abi, protocolToken.address);

          const allowances = await erc20Instance.methods
            .allowance(account, onChainWalletAddress)
            .call({ from: account });

          if (new BN(allowances).lt(new BN(amount))) {
            const approvalTx = erc20Instance.methods.approve(onChainWalletAddress, amount);

            const approvalEstimate = await approvalTx.estimateGas({ from: account });
            setPageLoading?.('Submitting Approval Transaction....');
            await sendTransaction(approvalTx, {
              from: account,
              gas: approvalEstimate,
            });
          }

          setPageLoading?.('Submitting Delegation Transaction....');
          const fundGatewayInstance = await new window.web3.eth.Contract(
            fundGatewaylAbi,
            fundGatway
          );

          const depositEncodedData = fundGatewayInstance.methods
            .deposit(protocolToken.address, amount)
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
            [fundGatway, protocolToken.protocolContractAddress],
            [depositEncodedData, delegateData],
            1,
            1
          );
          const estimatedGas = await tx.estimateGas({ from: account });

          await sendTransaction(tx, {
            from: account,
            gas: estimatedGas,
          });
        } catch (e) {
          console.log(e);
        } finally {
          setPageLoading?.('');
        }
      }
    },
    [account, onChainWalletAddress, protocol]
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

        setPageLoading?.('Submitting Transaction....');

        await sendTransaction(transaction, {
          from: account,
          gas: estimatedGas,
        });
        // await transaction.send({
        //   from: account,
        //   gas: estimatedGas,
        // });
        await checkIfOnChainWalletExists();
      }
    } catch (e) {
      console.log("error on deploy on chain wallet", e);
    } finally {
      setPageLoading?.('');
    }
  }, [account, checkIfOnChainWalletExists, setPageLoading]);

  const swapAndStake = useCallback(
    async (
      validator: string,
      sourceToken: string,
      sourceTokenAmount: string,
      slippage: string = "1"
    ) => {
      let depositEncodedData;
      if (account) {
        try {
          setPageLoading?.('Submitting Transaction....');
          const protocolToken = getTokenByProtocol(protocol);
          const destinationToken = protocolToken.address;
          if (sourceToken !== ETH_TOKEN) {
            const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);
            const allowances = await sourceTokenInstance.methods
              .allowance(account, onChainWalletAddress)
              .call({ from: account });

            if (new BN(allowances).lt(new BN(sourceTokenAmount))) {

              const approveTransaction = sourceTokenInstance.methods.approve(
                onChainWalletAddress,
                sourceTokenAmount
              );
              const gasForApproval = await approveTransaction.estimateGas();
              setPageLoading?.('Submitting Approval Transaction....');
              console.log('approval transaction');
              await sendTransaction(approveTransaction, {
                from: account,
                gas: gasForApproval,
              });
            }
            setPageLoading?.('Submitting Delegation Transaction....');
            const fundGatewayInstance = await new window.web3.eth.Contract(
              fundGatewaylAbi,
              fundGatway
            );

            depositEncodedData = fundGatewayInstance.methods
              .deposit(protocolToken.address, sourceTokenAmount)
              .encodeABI();

          }

          setPageLoading?.('Submitting Swap and Stake Transaction....');
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
          const maticInstance = new window.web3.eth.Contract(maticProtocolAbi, maticProtocol);

          let delegateData;
          if (protocol === StakingProtocol.GRAPH) {
            delegateData = graphInstance.methods
              .delegate(
                validator,
                new BN(swapAmount).mul(new BN(9)).div(new BN(10)).toString(), //"100971045019998194761",
                1 // getId
              )
              .encodeABI();
          } else {
            delegateData = maticInstance.methods
              .buyShare(
                validator,
                new BN(swapAmount).mul(new BN(9)).div(new BN(10)).toString(),
                0, // min share,
                1 // get id
              )
              .encodeABI();
          }

          const transaction = userWalletInstance.methods.executeMulti(
            [fundGatway, oneInch, protocolToken.protocolContractAddress],
            [depositEncodedData, swapTransactionEncodedData, delegateData],
            1,
            1
          );
          const estimatedGas = await transaction.estimateGas({ from: account, value: ethvalue });

          await sendTransaction(transaction, {
            from: account || "",
            gas: estimatedGas,
            value: ethvalue,
          });
        } catch (e) {
          console.log("error in swap and stake ", e);
        } finally {
          setPageLoading?.('');
        }
      }

    },
    [account, onChainWalletAddress, protocol]
  );

  const borrowSwapAndStake = useCallback(
    async (
      validator: string, //validator
      sourceToken: string, //deposit Token input dropdown
      depositAmount: string, //input
      borrowAmount: string, // calculate hardcoded for now
      borrowTokenAddress: string, // borrowId selected from table
      rateMode: string, // 1 or 2 radio
      slippage: string = "1"
    ) => {
      try {
        setPageLoading?.('Submitting Transaction....');
        const protocolToken = getTokenByProtocol(protocol);

        let depositEncodedData;
        if (sourceToken !== ETH_TOKEN) {
          setPageLoading?.('Submitting Approval Transaction....');
          const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);

          const allowances = await sourceTokenInstance.methods
            .allowance(account, onChainWalletAddress)
            .call({ from: account });

          if (new BN(allowances).lt(new BN(depositAmount))) {

            const approveTransaction = sourceTokenInstance.methods.approve(
              onChainWalletAddress,
              depositAmount
            );
            const gasForApproval = await approveTransaction.estimateGas();
            setPageLoading?.('Submitting Approval Transaction....');
            console.log('approval transaction');
            await sendTransaction(approveTransaction, {
              from: account || "",
              gas: gasForApproval,
            });
          }

          setPageLoading?.('Submitting Delegation Transaction....');
          const fundGatewayInstance = await new window.web3.eth.Contract(
            fundGatewaylAbi,
            fundGatway
          );

          depositEncodedData = fundGatewayInstance.methods
            .deposit(protocolToken.address, depositAmount)
            .encodeABI();
        }

        setPageLoading?.('Submitting Borrow, Swap and Stake Transaction....');

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

        let destinationToken = protocolToken.address;

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
        const maticInstance = new window.web3.eth.Contract(maticProtocolAbi, maticProtocol);

        let delegateData;
        if (protocol === StakingProtocol.GRAPH) {
          delegateData = graphInstance.methods
            .delegate(
              validator,
              swapAmount,
              1 // getId
            )
            .encodeABI();
        } else {
          delegateData = maticInstance.methods
            .buyShare(
              validator,
              swapAmount,
              0, // min share,
              1 // get id
            )
            .encodeABI();
        }

        const transaction = userWalletInstance.methods.executeMulti(
          [fundGatway, aaveProtocol, oneInch, protocolToken.protocolContractAddress],
          [depositEncodedData, aaveDepositAndBorrowEncodedData, swapTransactionEncodedData, delegateData],
          1,
          1
        );

        const estimatedGas = await transaction.estimateGas({ from: account, value: ethvalue });

        await sendTransaction(transaction, {
          from: account || "",
          gas: estimatedGas,
          value: ethvalue,
        });
      } catch (e) {
      } finally {
        setPageLoading?.('');
      }
    },
    [account, onChainWalletAddress, protocol]
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
      abiDecoder.addABI(maticProtocolAbi);

      const graphDelegation: GraphProtocolDelegation[] = [];
      const aaveBorrows: AAVEBorrows[] = [];
      const maticDelegation: MaticProtocolDelegation[] = [];

      for (let i = 0; i < receipts.length; i++) {
        if (!receipts[i]) {
          continue;
        }

        const block = await window.web3.eth.getBlock(receipts[i].blockNumber);
        const decodedReceipt = abiDecoder.decodeLogs(receipts[i].logs);
        decodedReceipt
          .filter(
            (dr: { name: string }) =>
              dr.name == "GraphProtocolDelegated" ||
              dr.name === "Borrow" ||
              dr.name === "MaticValidatorDelegated"
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
              const depositToken =
                contractMap[window.web3.utils.toChecksumAddress(event.events[0].value)];
              const borrowToken =
                contractMap[window.web3.utils.toChecksumAddress(event.events[2].value)];

              aaveBorrows.push({
                depositToken: event.events[0].value,
                depositAmt: `${parseFloat(
                  fromWei(event.events[1].value, depositToken.decimals)
                ).toFixed(2)} ${depositToken.symbol}`,
                borrowToken: event.events[2].value,
                borrowAmt: `${parseFloat(
                  fromWei(event.events[3].value, borrowToken.decimals)
                ).toFixed(2)} ${borrowToken.symbol}`,
                rateMode: parseInt(event.events[4].value) === 1 ? 'STABLE': 'VARIABLE',
                blockTimestamp: formatDate(block.timestamp),
              });
            }

            if (event.name === "MaticValidatorDelegated") {
              maticDelegation.push({
                validator: event.events[0].value,
                amount: `${parseFloat(fromWei(event.events[2].value)).toFixed(2)} MATIC`,
                blockNumber: receipts[i].blockNumber,
                blockTimestamp: formatDate(block.timestamp),
              });
            }
          });
      }
      return {
        graphProtocolDelegation: graphDelegation,
        aaveBorrows,
        maticProtocolDelegation: maticDelegation,
      };
    }
    return {
      graphProtocolDelegation: [],
      aaveBorrows: [],
      maticProtocolDelegation: [],
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
