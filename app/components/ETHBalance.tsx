import {useMemo} from "react";
import type {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import useETHBalance from "../hooks/useETHBalance";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {isConnected} from "../util";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";


const useBalanceStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: '100%',
        },
    })
)
const ETHBalance = () => {
    const classes = useBalanceStyles();
    const {account, library} = useWeb3React<Web3Provider>();
    const {data} = useETHBalance(account);

    const isAccountConnected = useMemo(() => isConnected(account, library), [account, library]);
    if (!isAccountConnected) {
        return (
            <Grid className={classes.container} container direction="column" alignItems="center" justify="center">
                <Typography component="div" variant="body1">Connect your wallet</Typography>
            </Grid>
        )
    }
    return (
        <Grid className={classes.container} container direction="column" alignItems="center" justify="center">
            <Typography component="div" variant="h3">Wallet Balance</Typography>
            <Typography component="div" variant="h4">{data}</Typography>
        </Grid>
    )
};

export default ETHBalance;
