import type { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import {useWeb3ReactWrapper} from "./useWeb3ReactWrapper";

export default function useENSName(address?: string | null) {
  const { library, chainId } = useWeb3ReactWrapper<Web3Provider>();
  const [ENSName, setENSName] = useState("");

  useEffect(() => {
    if (library && typeof address === "string") {
      let stale = false;

      library
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === "string") {
            setENSName(name);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setENSName("");
      };
    }
  }, [library, address, chainId]);

  return ENSName;
}
