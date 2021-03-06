import axios, {AxiosResponse} from "axios";
import { ETH_TOKEN } from "../constants/contracts";
import { BalanceDetailsMap, getAddressBalances } from "../util";
import {MaticResponse} from "../types/Matic";

const covalentKey = "ckey_1291e35627894f6a92e8c0283ac";
const covalentBaseUrl = "https://api.covalenthq.com";

const api = axios.create({
    headers: {
        Accept: "application/json",
    },
});

export const covalent = {
    getAllBalance: async (chainId: string | number, address: string): Promise<BalanceDetailsMap> => {
        try{
        
            const tokenBalances = await getAddressBalances(address);
            const symbolAddressMap: {
                [key: string]: string;
            } = {};
            Object.keys(tokenBalances).forEach((address) => {
                const symbol: string = tokenBalances[address].symbol;
                symbolAddressMap[symbol] = address;
            });
            const tickers = Object.keys(symbolAddressMap).join(",");
            const priceResponse = await api.get(
                `${covalentBaseUrl}/v1/pricing/tickers/?tickers=${tickers}&key=${covalentKey}`
            );
    
            const priceResponseItems = priceResponse.data.data.items;
            for (let i = 0; i < priceResponseItems.length; i++) {
                const symbol = priceResponseItems[i].contract_ticker_symbol == "WETH" ? "ETH" : priceResponseItems[i].contract_ticker_symbol;
                const address = symbolAddressMap[symbol];
                if (address &&
            (address.toLowerCase() === priceResponseItems[i].contract_address.toLowerCase() ||
              (priceResponseItems[i].contract_ticker_symbol === "WETH" && address === ETH_TOKEN))) {
                    tokenBalances[address].usdPrice = priceResponseItems[i].quote_rate;
                }
            }
    
            return tokenBalances;

        }
        catch(e) {
            console.log('error on fetching balances');
            console.log(e);
            return {}
        }

    },
};

export const matic = {
    getIndexers: async (): Promise<AxiosResponse<MaticResponse>> => {
        const request = 'https://sentinel.matic.network/api/v2/validators?limit=100&offset=0&sortBy=uptimePercent&inAuction=false&moveStakeEnabled=false';
        return api.get(request);
    }
}

export const oneInchApi = {
    getSwapDetails: (
        sourceToken: string,
        destinationToken: string,
        sourceTokenAmount: string,
        slippage: string,
        onChainWalletAddress: string
    ) => {
        const request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${sourceTokenAmount}&slippage=${slippage}&fromAddress=${onChainWalletAddress}&disableEstimate=true`;
        return api.get(request);
    },

    getEstimatedSwapDetails: (
        sourceToken: string,
        destinationToken: string,
        swapAmount: string,
        slippage: string,
        onChainWalletAddress: string
    ) => {
        const request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${swapAmount}&slippage=${slippage}&fromAddress=${onChainWalletAddress}&disableEstimate=true`;
        return api.get(request);
    },
};
