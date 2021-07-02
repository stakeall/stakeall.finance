import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import Web3 from "web3";
import BN from "bn.js";
import {  getDefaultContractAddress } from "./constants/contractMap";
import { ETH_TOKEN } from "./constants/contracts";

export function shortenHex(hex?: string | null, length = 4) {
  if (!hex) return "";
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

const ETHERSCAN_PREFIXES: Record<number, string> = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export function formatEtherscanLink(
  type?: "Account" | "Transaction",
  data?: [number | undefined, string | null | undefined]
) {
  if (!type || !data) {
    return "";
  }
  const [chainId, addressOrHash] = data;
  if (!chainId || !addressOrHash) {
    return "";
  }
  switch (type) {
    case "Account": {
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${addressOrHash}`;
    }
    case "Transaction": {
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${addressOrHash}`;
    }
  }
}

export const parseBalance = (balance: BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

export const isConnected = (account?: unknown, library?: unknown) =>
  typeof account === "string" && !!library;

export const truncateMiddle = (str: string) => {
  if (str.length <= 10) {
    return str;
  }
  const firstPart = str.substr(0, 5);
  const lastPart = str.substr(length - 5, 5);
  return `${firstPart}...${lastPart}`;
};

export const formatToken = (str: string) => {
  const base = parseFloat(str) / 10 ** 18;
  if (base / 10 ** 3 < 1) {
    return base.toFixed(2);
  } else if (base / 10 ** 6 < 1) {
    return `${(base / 10 ** 3).toFixed(2)}K`;
  }
  return `${(base / 10 ** 6).toFixed(2)}M`;
};

export const createMetamaskTokenUrl = (str: string) => {
  return `https://raw.githubusercontent.com/MetaMask/contract-metadata/master/images/${str}`;
};

function getContract(provider: Web3, address?: string) {
  return new provider.eth.Contract(
    [
      { payable: true, stateMutability: "payable", type: "fallback" },
      {
        constant: true,
        inputs: [
          { name: "user", type: "address" },
          { name: "token", type: "address" },
        ],
        name: "tokenBalance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [
          { name: "users", type: "address[]" },
          { name: "tokens", type: "address[]" },
        ],
        name: "balances",
        outputs: [{ name: "", type: "uint256[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    address || "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39"
  );
}

export type BalanceMap = {
  [tokenAddress: string]: string;
};

export type AddressBalanceMap = {
  [address: string]: BalanceMap;
};

function formatAddressBalances<T>(
  values: string[],
  addresses: string[],
  tokens: string[]
): AddressBalanceMap {
  const balances: AddressBalanceMap = {};
  addresses.forEach((addr, addrIdx) => {
    balances[addr] = {};
    tokens.forEach((tokenAddr, tokenIdx) => {
      const balance = values[addrIdx * tokens.length + tokenIdx];
      if (balance != "0") {
        balances[addr][tokenAddr] = balance.toString();
      }
    });
  });

  return balances;
}

export type BalanceDetailsMap = {
  [key: string]: {
    name: string;
    erc20: boolean;
    symbol: string;
    decimals: number;
    imgSrc?: string;
    logo?: string;
    balance?: string;
    usdPrice?: string;
  };
};

export async function getAddressBalances(address: string): Promise<BalanceDetailsMap> {
  if (typeof window == "undefined" || !window.web3 || !window.web3.eth) {
    return {};
  }

  const contractsMap = getDefaultContractAddress();
  const tokens = Object.keys(contractsMap);

  const contract = getContract(window.web3);
  let result: BalanceMap = {};
  for (let i = 0; i < tokens.length; i += 20) {
    const subset = tokens.slice(i, i + 20);
    const balances = await contract.methods.balances([address], subset).call();
    result = {
      ...result,
      ...formatAddressBalances<BN>(balances, [address], subset)[address],
    };
  }

  let formattedResult: BalanceDetailsMap = {};

  const nonZeroBalanceAddress = Object.keys(result);
  for (let i = 0; i < nonZeroBalanceAddress.length; i++) {
    const address = nonZeroBalanceAddress[i];
    formattedResult[address] = {
      ...contractsMap[address],
      balance: result[address],
      imgSrc: createMetamaskTokenUrl(contractsMap[address].logo || '')
    };
  }

  const ethBalance = await window.web3.eth.getBalance(address);
  return {
    [ETH_TOKEN]: {
      name: "Ethereum",
      erc20: false,
      symbol: "ETH",
      decimals: 18,
      balance: ethBalance,
      imgSrc: 'https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    },
    ...formattedResult,
  };
}

export const formatBalance = (balance: string, decimal: number):string => {
  if(!balance || balance.length === 0) {
    return '-';
  }
  const base = new BN(10).pow(new BN(decimal));
  // @ts-ignore
  const dm = new BN(balance).divmod(base);
  return parseFloat(dm.div + "." + dm.mod.toString(10, decimal)).toFixed(3);
}


// todo Sarvesh Fix the logic for amount with decimals amount = 0.1
export const toWei = (amount: string, decimal: number): string  => {
  const formatredamt = (parseFloat(amount) * 10000).toFixed(0);
  return (new BN(formatredamt).mul(new BN(10).pow(new BN(decimal))).div(new BN(10000))).toString(10);
}

export const fromWei = (amount: string): string  => {
  
  return window.web3.utils.fromWei(amount);
}

export const getBN = (amount: string, decimals: number | string) => {
  const [whole, fractional] = amount.split('.');
  const wholeBN = new BN(whole);
  const fractionalBN = new BN(fractional);
  const decimalsBN = new BN(decimals || 1);
  const tenBN = new BN(10)
  const fractionalLengthBN = new BN(fractional?.length || 1);
  return wholeBN
      .mul(tenBN
          .pow(fractionalLengthBN)
      )
      .add(fractionalBN)
      .mul(tenBN
          .pow(decimalsBN
              .sub(fractionalLengthBN)
          )
      )
}

export const isNumeric = (num: string) => /^-?\d*\.?\d+$/.test(num);

export const formatDate = (timestamp: number) => {
  return new Date( parseInt(timestamp) * 1000 ).toLocaleDateString("en-US")
}