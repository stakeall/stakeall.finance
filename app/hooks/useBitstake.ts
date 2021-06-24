import {graphProtocol, graphToken, bitStakeRegistry, ZERO_ADDRESS} from "../constants/contracts";
import {erc20Abi} from "../abi/erc20";
import {graphProtocolAbi} from "../abi/graphProtocolRegistry";
import {bitStakeRegistryABI} from "../abi/bitStakeRegistry";
import {useWeb3React} from "@web3-react/core";
import {userWalletRegistryAbi} from "../abi/userWalletRegistry";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";

export const useBitstake =   () => {
    const { account } = useWeb3React()
    const [onChainWalletAddress, setOnChainWalletAddress] = useState<string>('');
    const {setPageLoading} = useContext(AppCommon);

    const checkIfOnChainWalletExists = async () => {
        if(typeof window !== 'undefined' &&  window.web3?.eth && account) {
            const bitStakeRegistryInstance = new window.web3.eth.Contract(
                bitStakeRegistryABI,
                bitStakeRegistry
            );
            const walletAddress = await bitStakeRegistryInstance.methods.proxies(account).call();
            setOnChainWalletAddress(walletAddress);
        }
    }

    const onChainWalletAddressExists = useMemo(() => !!onChainWalletAddress && onChainWalletAddress !== ZERO_ADDRESS, [onChainWalletAddress])

    const delegate = useCallback(async (indexerId: string, amount: string) => {
        if(typeof window !== 'undefined' && account) {
            const graphInstance = new window.web3.eth.Contract(graphProtocolAbi, graphProtocol);
            const grtERC20Instance = new window.web3.eth.Contract(erc20Abi, graphToken);
            await grtERC20Instance.methods.approve('0x33121d2246bbca5b04bb09f565d90ee9d68ecb78', amount).send({
                from: account,
                gas: 300000,
            });
            const data = graphInstance.methods.delegate(
                indexerId,
                amount
            ).encodeABI();
            const userWalletInstance = new window.web3.eth.Contract(userWalletRegistryAbi, '0x33121d2246bbca5b04bb09f565d90ee9d68ecb78');
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
    }, [account]);

    const deployOnChainWallet = useCallback(async () => {
        try {
            if(typeof window !== 'undefined' && account) {
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
        }
        catch(e) {
            console.log('deploy on chain wallet error');
            setPageLoading?.(false);
        }
    }, [account, checkIfOnChainWalletExists])

    useEffect(() => {
        if(account) {
            checkIfOnChainWalletExists();
        }
    }, [account])




    return {
        delegate,
        onChainWalletAddress,
        onChainWalletAddressExists,
        deployOnChainWallet,
    }
}