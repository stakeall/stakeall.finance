import {createContext} from "react";

interface BitstakeContextData {
    delegate: (indexerId: string, amount: string) => void,
    deployOnChainWallet: () => void,

    onChainWalletAddress: string,
    onChainWalletAddressExists: boolean,
}

export const Bitstake = createContext<Partial<BitstakeContextData>>({});