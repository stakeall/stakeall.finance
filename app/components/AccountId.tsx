import {shortenHex} from "../util";
import useENSName from "../hooks/useENSName";
import {useWeb3React} from "@web3-react/core";
import {Typography} from "@material-ui/core";

export const AccountId = () => {
    const {
        account,
    } = useWeb3React();

    const ENSName = useENSName(account);

    return (
        <Typography variant="body2" color="textSecondary">
            {ENSName || `${shortenHex(account, 4)}`}
        </Typography>
    )
}