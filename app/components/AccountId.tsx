import {shortenHex, useWeb3ReactWrapper} from "../util";
import useENSName from "../hooks/useENSName";
import {useWeb3React} from "@web3-react/core";
import {Typography} from "@material-ui/core";
import {useContext} from "react";
import {Bitstake} from "../contexts/Bitstake";

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