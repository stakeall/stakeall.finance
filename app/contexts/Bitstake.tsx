import {createContext, useCallback} from "react";

interface BitstakeContextData {
    delegate: (indexerId: string, amount: string) => void,
    deployOnChainWallet: () => void,

    onChainWalletAddress: string,
    onChainWalletAddressExists: boolean,

    swapAndStake: (indexer: string, sourceToken: string, destinationToken: string, sourceTokenAmount: string, slippage?: string) => void
    getEstimatedSwapAmount: (sourceToken: string, destinationToken: string, swapAmount: string, slippage?: string) => void
}

export const Bitstake = createContext<Partial<BitstakeContextData>>({});