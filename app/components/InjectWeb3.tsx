import {useContext, useEffect} from "react";
import Web3 from "web3";
import {AppCommon} from "../contexts/AppCommon";
import {useWeb3React} from "@web3-react/core";

declare global {
    interface Window {
        ethereum?: any;
        web3?: any;
    }
}
export const InjectWeb3 = () => {
    const { injectedEth, setInjectedEth } = useContext(AppCommon);
    const { account } = useWeb3React();
    useEffect(() => {
        const enableEth = async () => {
            if (window.ethereum && !injectedEth) {
                window.web3 = new Web3(window.ethereum);
                setInjectedEth?.(true);
                return true;
            }
            return false;
        }
        enableEth();
    }, [account])
    return null;
}