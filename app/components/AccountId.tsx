import {shortenHex} from "../util";
import useENSName from "../hooks/useENSName";
import {Typography} from "@material-ui/core";
import {useContext} from "react";
import {Bitstake} from "../contexts/Bitstake";
import {useWeb3ReactWrapper} from "../hooks/useWeb3ReactWrapper";

export const AccountId = () => {
    const {
        account,
    } = useWeb3ReactWrapper();
    const { onChainWalletAddress } = useContext(Bitstake);

    const ENSName = useENSName(account);

    return (
        <>
            <Typography variant="body2" color="textSecondary">
                {ENSName || `${shortenHex(account, 4)}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {shortenHex(onChainWalletAddress, 4)}
            </Typography>
            </>
    )
}