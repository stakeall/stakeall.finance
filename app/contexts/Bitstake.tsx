import {createContext, useCallback} from "react";
import { UserActionResponse } from "../hooks/useBitstake";

interface BitstakeContextData {
    delegate: (indexerId: string, amount: string) => void,
    deployOnChainWallet: () => void,

    onChainWalletAddress: string,
    onChainWalletAddressExists: boolean,

    swapAndStake: (indexer: string, sourceToken: string, sourceTokenAmount: string, slippage?: string) => void
    borrowSwapAndStake: (
        indexer: string,
        sourceToken: string,
        destinationToken: string,
        depositAmount: string,
        borrowAmount: string,
        borrowTokenAddress: string,
        rateMode: string,
        slippage?: string,
) => void

    getEstimatedSwapAmount: (sourceToken: string, destinationToken: string, swapAmount: string, slippage?: string) => Promise<string>

    getTokenBalance(address: string):Promise<string>

    getUserActions(address: string):Promise<UserActionResponse>
}

export const Bitstake = createContext<Partial<BitstakeContextData>>({});