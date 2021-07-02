const metamaskContractMap = require('@metamask/contract-metadata');
import {ETH_TOKEN} from "./contracts";
import {tokens} from '../token';


export type InitalContractMap = {
    [key: string]: {
        name: string,
        erc20: boolean,
        symbol: string,
        decimals: number,
        imgSrc?: string,
        logo?: string,
    }
}
export type ContractMap = {
    [key: string]: {
        name: string,
        erc20: boolean,
        symbol: string,
        decimals: number,
        imgSrc?: string,
        logo?: string,
        id: string,
    }
}

const contractMapInitial: InitalContractMap= {
    ...(metamaskContractMap as InitalContractMap),
    [ETH_TOKEN]: {
        name: "Ethereum",
        erc20: false,
        symbol: "ETH",
        decimals: 18,
        imgSrc: 'https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    },
};

export const contractMap: ContractMap = Object.keys(contractMapInitial).reduce((acc, item) => {
    if(tokens[item]) {
        return {
            ...acc,
            [item]: {
                ...contractMapInitial[item],
                id: item,
            }
        }
    }
    return acc;
    
}, {});


export const getDefaultContractAddress = (): InitalContractMap => {
    const res: InitalContractMap  = {}
    Object.keys(tokens).map(t =>  {
        res[t] = metamaskContractMap[t]
    });
    return res;
}