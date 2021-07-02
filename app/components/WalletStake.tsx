import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Bitstake} from "../contexts/Bitstake";
import {AppCommon} from "../contexts/AppCommon";
import {Paper} from "@material-ui/core";
import useETHBalance from "../hooks/useETHBalance";
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {isNumeric, shortenHex} from "../util";
import {graphToken, GRT_DECIMAL} from "../constants/contracts";
import {formatBalance, toWei} from '../util';

const useWalletStakeStyles = makeStyles((theme) =>
    createStyles({
        walletContainer: {
            margin: '20px',
            padding: theme.spacing(5),
        },
        validator: {
            padding: theme.spacing(5),
        },
        amount: {
            paddingLeft: theme.spacing(5),
            width: '400px',
        },
        buttonContainer: {
            padding: theme.spacing(5),
        },
    })
)
export const WalletStake: React.FC = () => {

    const classes = useWalletStakeStyles();
    const {validator} = useContext(AppCommon);
    const {delegate, getTokenBalance} = useContext(Bitstake);
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [clicked, setClicked] = useState<boolean>(true);
    const {account, chainId} = useWeb3React<Web3Provider>();
    //const {data} = useETHBalance(account);

    useEffect(() => {
        setClicked(false);
        setAmount('');
        setAmountError('');
    }, [])

    useEffect(() => {
        const fetchAmount = async () => {
            const amount = await getTokenBalance?.(graphToken);
            setData(formatBalance(amount || '', GRT_DECIMAL));
        }

        if (account) {
            fetchAmount();
        }

    }, [account, chainId])

    const validateAmount = useCallback(() => {
        if(!isNumeric(amount)) {
            setAmountError('Enter valid amount')
            return false;
        }
        return true;
    }, [amount]);

    return (
        <Paper className={classes.walletContainer} elevation={2}>
            <Grid className={classes.validator}>
                <Typography variant="body1" color="secondary" id="modal-modal-description">
                    Validator Id : {shortenHex(validator)}
                </Typography>
            </Grid>
            <Grid className={classes.amount}>
                <Typography color="textSecondary" id="balance" variant="body1">
                    Balance: {data}
                </Typography>
                <TextField
                    value={amount}
                    error={amountError !== ''}
                    helperText={amountError}
                    type="number"
                    onChange={(e) => {
                        setAmountError('');
                        setAmount(e.target.value)
                    }}
                    label="Amount"
                    fullWidth
                />
            </Grid>
            <Grid className={classes.buttonContainer} container spacing={2}>
                <Grid item>
                    <Button color="secondary" variant="outlined" onClick={() => {
                        setClicked(true);
                        if (validator && validateAmount()) {
                            delegate?.(validator, toWei(amount, GRT_DECIMAL))
                        }
                    }}>
                        Delegate
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}