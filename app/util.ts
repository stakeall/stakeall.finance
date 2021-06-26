import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

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

