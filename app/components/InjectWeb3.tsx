import {useEffect} from "react";
import Web3 from "web3";

declare global {
    interface Window {
        ethereum?: any;
        web3?: any;
    }
}
export const InjectWeb3 = () => {
    useEffect(() => {
        const ethEnabled = async () => {
            if (window.ethereum) {
                await window.ethereum.send('eth_requestAccounts');
                window.web3 = new Web3(window.ethereum);
                return true;
            }
            return false;
        }
        ethEnabled();
    }, [])
    return null;
}