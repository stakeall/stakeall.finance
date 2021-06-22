import axios, {AxiosResponse} from "axios";
import {BalanceResponse} from "../types/Covalent";

const covalentKey = 'ckey_1291e35627894f6a92e8c0283ac';
const covalentBaseUrl = 'https://api.covalenthq.com';


const api = axios.create({
    headers: {
        'Accept': 'application/json'
    }
})

export const covalent = {
    getAllBalance: (chainId: string | number, address: string) => {
        return api.get<{}, BalanceResponse>(`${covalentBaseUrl}/v1/${chainId}/address/${address}/balances_v2/?&key=${covalentKey}`)
    }
}