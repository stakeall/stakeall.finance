import { graphProtocol, graphToken, bitStakeRegistry, ZERO_ADDRESS, oneInch, ETH_TOKEN, aaveProtocol} from "../constants/contracts";
import {erc20Abi} from "../abi/erc20";
import {graphProtocolAbi} from "../abi/graphProtocolRegistry";
import {bitStakeRegistryABI} from "../abi/bitStakeRegistry";
import {oneInchRegistryABI} from "../abi/oneInchRegistry";
import { aaveProtocolABI} from "../abi/aaveProtocol";
import {userWalletRegistryAbi} from "../abi/userWalletRegistry";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";
import {oneInchApi} from "../api/api";
import {Contract} from "@ethersproject/contracts";
import {useWeb3React} from "@web3-react/core";
import {injected} from "../connectors";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const useBitstake = () => {
    const {active, account, library, chainId} = useWeb3React()
    const [onChainWalletAddress, setOnChainWalletAddress] = useState<string>('');
    const {setPageInactive, setPageInactiveReason, setPageLoading} = useContext(AppCommon);

    const onChainWalletAddressExists = useMemo(() => !!onChainWalletAddress && onChainWalletAddress !== ZERO_ADDRESS, [onChainWalletAddress]);

    const checkIfOnChainWalletExists = async () => {
        if (typeof window !== 'undefined' && window.web3?.eth && account) {
            const bitStakeRegistryInstance = new window.web3.eth.Contract(
                bitStakeRegistryABI,
                bitStakeRegistry
            );
            const walletAddress = await bitStakeRegistryInstance.methods.proxies(account).call();
            setOnChainWalletAddress(walletAddress);
        }
    };

    useEffect(() => {
        if(injected.supportedChainIds?.includes(chainId || -1)) {
            setPageInactive?.(false);
            setPageInactiveReason?.('');
        }
        else {
            setPageInactive?.(true);
            setPageInactiveReason?.('Unsupported Network');
        }
    }, [chainId, account])

    useEffect(() => {
        console.log({account});
        if (account) {
            checkIfOnChainWalletExists();
        }
    }, [account]);



    const delegate = useCallback(async (indexerId: string, amount: string) => {
        if (typeof window !== 'undefined' && account) {
            const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
            const grtERC20Instance = new window.web3.eth.Contract(erc20Abi, graphToken);
            await grtERC20Instance.methods.approve(onChainWalletAddress, amount).send({
                from: account,
                gas: 300000,
            });
            const data = graphInstance.methods.delegate(
                indexerId,
                amount,
                0 // getId
            ).encodeABI();
            const userWalletInstance = new window.web3.eth.Contract(userWalletRegistryAbi, onChainWalletAddress);
            await userWalletInstance.methods.executeMulti(
                [graphProtocol],
                [data],
                1,
                1
            ).send({
                from: account,
                gas: 300000,
            });
        }
    }, [account, onChainWalletAddress]);

    const deployOnChainWallet = useCallback(async () => {
        try {
            if (typeof window !== 'undefined' && account) {
                const bitStakeRegistryInstance = new window.web3.eth.Contract(
                    bitStakeRegistryABI,
                    bitStakeRegistry
                );

                const transaction = await bitStakeRegistryInstance.methods.build();
                const estimatedGas = await transaction.estimateGas({from: account});


                setPageLoading?.(true);
                await transaction.send({
                    from: account,
                    gas: estimatedGas
                });
                setPageLoading?.(false);

                await checkIfOnChainWalletExists();

            }
        } catch (e) {
            setPageLoading?.(false);
        }
    }, [account, checkIfOnChainWalletExists, setPageLoading]);


    const swapAndStake = useCallback(async (indexer: string, sourceToken: string, sourceTokenAmount: string, slippage: string = '1') => {
        const destinationToken = graphToken;
        if (sourceToken !== ETH_TOKEN) {
            // approval

          const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);

          const approveTransaction = sourceTokenInstance.methods.approve(onChainWalletAddress, sourceTokenAmount);

          const gasForApproval = approveTransaction.estimateGas();

          await approveTransaction.send({
            from: account,
            gas: gasForApproval,
          })


        }

        const swapResponse = await oneInchApi.getSwapDetails(sourceToken, destinationToken, sourceTokenAmount, slippage, onChainWalletAddress);

        const userWalletInstance = new window.web3.eth.Contract(userWalletRegistryAbi, onChainWalletAddress);

        const oneInchProxy = new window.web3.eth.Contract(oneInchRegistryABI, oneInch);

        const swapAmount = swapResponse.data.toTokenAmount;
        const swapTransactionEncodedData = oneInchProxy.methods.swap(
            sourceTokenAmount,
            sourceToken,
            destinationToken,
            swapResponse.data.tx.to,
            swapResponse.data.tx.data,
            sourceToken === ETH_TOKEN ? sourceTokenAmount : 0,
            0, // getId
            1 // setId
        ).encodeABI();

        const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
        const graphProtocolEncodedData = graphInstance.methods.delegate(
            indexer,
            swapAmount * 0.90,//"100971045019998194761",
            1 // getId
        ).encodeABI();

        const transaction = userWalletInstance.methods.executeMulti(
            [oneInch, graphToken],
            [swapTransactionEncodedData, graphProtocolEncodedData],
            1,
            1
        );
        const estimatedGas = await transaction.estimateGas({from: account});

        setPageLoading?.(true);
        await transaction.send({
            from: account,
            gas: estimatedGas
        });
        setPageLoading?.(false);

    }, [account, onChainWalletAddress]);

  const borrowSwapAndStake = useCallback(async (indexer: string, sourceToken: string, destinationToken: string, depositAmount: string, borrowAmount: string, borrowTokenAddress: string, rateMode: string, slippage: string = '1') => {
    if (sourceToken !== ETH_TOKEN) {
      // approval

      const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);

      const approveTransaction = sourceTokenInstance.methods.approve(onChainWalletAddress, depositAmount);

      const gasForApproval = approveTransaction.estimateGas();

      await approveTransaction.send({
        from: account,
        gas: gasForApproval,
      });

    }

    const aaveInstance = new window.web3.eth.Contract(aaveProtocolABI, aaveProtocol);

    const aaveDepositAndBorrowEncodedData = aaveInstance.methods.depositAndBorrow(
      sourceToken,
      borrowTokenAddress,
      depositAmount,
      borrowAmount,
      rateMode,
      0,
      1 // setId
    ).encodeABI();

    const swapResponse = await oneInchApi.getSwapDetails(borrowTokenAddress, destinationToken, borrowAmount, slippage, onChainWalletAddress);

    const userWalletInstance = new window.web3.eth.Contract(userWalletRegistryAbi, onChainWalletAddress);

    const oneInchProxy = new window.web3.eth.Contract(oneInchRegistryABI, oneInch);

    const swapAmount = swapResponse.data.toTokenAmount;
    const swapTransactionEncodedData = oneInchProxy.methods.swap(
      borrowAmount,
      sourceToken,
      destinationToken,
      swapResponse.data.tx.to,
      swapResponse.data.tx.data,
      borrowTokenAddress === ETH_TOKEN ? borrowAmount : 0,
      1, // getId
      1 // setId
    ).encodeABI();

    const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
    const graphProtocolEncodedData = graphInstance.methods.delegate(
      indexer,
      swapResponse.data.toTokenAmount,
      1 // getId
    ).encodeABI();

    const transaction = userWalletInstance.methods.executeMulti(
      [aaveProtocol, oneInch, graphProtocol],
      [aaveDepositAndBorrowEncodedData, swapTransactionEncodedData, graphProtocolEncodedData],
      1,
      1
    );

    const estimatedGas = await transaction.estimateGas({ from: account });

    setPageLoading?.(true);
    await transaction.send({
      from: account,
      gas: estimatedGas
    });
    setPageLoading?.(false);

  }, [account, onChainWalletAddress]);


    // It will be called whenever user changes amount in the field in `swap and stake` tab.
    const getEstimatedSwapAmount = useCallback(async (sourceToken: string, destinationToken: string, swapAmount: string, slippage: string = '1') => {

        const request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${swapAmount}&slippage=${slippage}&fromAddress=${onChainWalletAddress}&disableEstimate=true`;

        const swapResponse = await oneInchApi.getEstimatedSwapDetails(sourceToken, destinationToken, swapAmount, slippage, onChainWalletAddress);

        return swapResponse.data.toTokenAmount;

    }, [onChainWalletAddress]);

  const getTokenBalance = useCallback(async (tokenAddress: string) => {

    if(tokenAddress === ETH_TOKEN) {
      return window.web3.eth.getBalance(account);
    } 
    else {
      const erc20Instance = new new window.web3.eth.Contract(erc20Abi, tokenAddress);
      return erc20Instance.methods.balanceOf(account);
    }
  }, [account]);

    return {
        delegate,
        onChainWalletAddress,
        onChainWalletAddressExists,
        deployOnChainWallet,
        swapAndStake,
        getEstimatedSwapAmount,
    }
}