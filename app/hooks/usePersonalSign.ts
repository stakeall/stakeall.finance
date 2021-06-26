import {useWeb3ReactWrapper} from "./useWeb3ReactWrapper";

export const hexlify = (message: string) =>
  "0x" + Buffer.from(message, "utf8").toString("hex");

export default function usePersonalSign() {
  const { library, account } = useWeb3ReactWrapper();

  return async (message: string) => {
    return library?.send("personal_sign", [hexlify(message), account]);
  };
}
