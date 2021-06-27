import axios, { AxiosResponse } from "axios";
import { getDefaultContractAddress } from "../constants/contractMap";
import { BalanceResponse } from "../types/Covalent";
import { BalanceDetailsMap, getAddressBalances } from "../util";

const covalentKey = "ckey_1291e35627894f6a92e8c0283ac";
const covalentBaseUrl = "https://api.covalenthq.com";

const api = axios.create({
  headers: {
    Accept: "application/json",
  },
});

export const covalent = {
  getAllBalance: async (chainId: string | number, address: string): Promise<BalanceDetailsMap> => {
    const tokenBalances = await getAddressBalances(address);
    const symbolAddressMap: {
        [key: string]: string
    } = {};
    Object.keys(tokenBalances).forEach((address) => {
        const symbol:string = tokenBalances[address].symbol;
        symbolAddressMap[symbol] = address;
    });    
    const tickers = Object.keys(symbolAddressMap).join(',');
    const priceResponse = await api.get(
      `${covalentBaseUrl}/v1/pricing/tickers/?tickers=${tickers}&key=${covalentKey}`
    );

    const priceResponseItems = priceResponse.data.data.items;
    for(let i =0; i<priceResponseItems.length; i++) {
        const symbol = priceResponseItems[i].contract_ticker_symbol =='WETH'?'ETH': priceResponseItems[i].contract_ticker_symbol;
        const address = symbolAddressMap[symbol];
        if(address) {
            tokenBalances[address].usdPrice = priceResponseItems[i].quote_rate;
        }
    }

    return tokenBalances;
  },
};

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
