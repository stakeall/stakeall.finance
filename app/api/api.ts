import axios, {AxiosResponse} from "axios";
import { getDefaultContractAddress } from "../constants/contractMap";
import {BalanceResponse} from "../types/Covalent";
import { BalanceDetailsMap, getAddressBalances } from "../util";

const covalentKey = 'ckey_1291e35627894f6a92e8c0283ac';
const covalentBaseUrl = 'https://api.covalenthq.com';


const api = axios.create({
    headers: {
        'Accept': 'application/json'
    }
})

export const covalent = {
    getAllBalance: async (chainId: string | number, address: string): Promise<BalanceDetailsMap> => {
        if(chainId == 31337) {
            chainId = 1;
        }
        const result = await getAddressBalances(address);
        return result;
        //console.log(result);
       // return api.get<{}, BalanceResponse>(`${covalentBaseUrl}/v1/${chainId}/address/${address}/balances_v2/?&key=${covalentKey}`)
    },

}

export const oneInchApi = {
    getSwapDetails: (sourceToken: string, destinationToken: string, sourceTokenAmount: string, slippage: string, onChainWalletAddress: string) => {
        const request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${sourceTokenAmount}&slippage=${slippage}&fromAddress=${onChainWalletAddress}&disableEstimate=true`;
        return api.get(request);
    },

    getEstimatedSwapDetails: (sourceToken: string, destinationToken: string, swapAmount: string, slippage: string, onChainWalletAddress: string) => {
        const request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${swapAmount}&slippage=${slippage}&fromAddress=${onChainWalletAddress}&disableEstimate=true`;
        return api.get(request);
    }
}