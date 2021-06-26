import {useMemo} from "react";
import {useWeb3React} from "@web3-react/core";

export const useWeb3ReactWrapper = <T=any, >(key?: string) => {
    const web3React = useWeb3React<T>(key);

    return useMemo(() => {
        const newAccount = web3React.account || (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress);
        const newChainId = web3React.chainId || (typeof window !== 'undefined' && window.ethereum && window.ethereum.networkVersion);
        return {
            ...web3React,
            account: newAccount,
            chainId: newChainId,
        }
    }, [web3React]);
};
