import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import {useWeb3ReactWrapper} from "./useWeb3ReactWrapper";

export default function useContract(
  address: string,
  ABI: ContractInterface,
  withSigner = false
) {
  const { library, account } = useWeb3ReactWrapper();

  return useMemo(
    () =>
      !!address && !!ABI && !!library
        ? new Contract(
            address,
            ABI,
            withSigner ? library.getSigner(account).connectUnchecked() : library
          )
        : undefined,
    [address, ABI, withSigner, library, account]
  );
}
