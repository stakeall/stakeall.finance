import {graphProtocol, graphToken, bitStakeRegistry, ZERO_ADDRESS, oneInch, ETH_TOKEN} from "../constants/contracts";
import {erc20Abi} from "../abi/erc20";
import {graphProtocolAbi} from "../abi/graphProtocolRegistry";
import {bitStakeRegistryABI} from "../abi/bitStakeRegistry";
import {oneInchRegistryABI} from "../abi/oneInchRegistry";
import {userWalletRegistryAbi} from "../abi/userWalletRegistry";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";
import {oneInchApi} from "../api/api";
import {useWeb3ReactWrapper} from "./useWeb3ReactWrapper";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const useBitstake = () => {
    const {account} = useWeb3ReactWrapper()
    const [onChainWalletAddress, setOnChainWalletAddress] = useState<string>('');
    const {setPageLoading, injectedEth} = useContext(AppCommon);

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
        if (account) {
            checkIfOnChainWalletExists();
        }
    }, [injectedEth]);


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
                amount
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
    }, [account, checkIfOnChainWalletExists]);


    const swapAndStake = useCallback(async (indexer: string, sourceToken: string, destinationToken: string, sourceTokenAmount: string, slippage: string = '1') => {
        if (sourceToken !== ETH_TOKEN) {
            // approval

            const sourceTokenInstance = new window.web3.eth.Contract(erc20Abi, sourceToken);
            await sourceTokenInstance.methods.approve(onChainWalletAddress, sourceTokenAmount).send({
                from: account,
                gas: 300000,
            });

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
            sourceToken === ETH_TOKEN ? 0 : sourceTokenAmount
        ).encodeABI();

        const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
        const graphProtocolEncodedData = graphInstance.methods.delegate(
            indexer,
            swapAmount * 0.90//"100971045019998194761"
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