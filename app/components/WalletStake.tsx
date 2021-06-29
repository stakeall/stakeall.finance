import {useContext, useEffect, useMemo, useState} from "react";
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
import {shortenHex} from "../util";
import { graphToken, GRT_DECIMAL} from "../constants/contracts";
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
    const [data, setData] = useState<string>('');
    const [clicked, setClicked] = useState<boolean>(true);
    const {account, chainId} = useWeb3React<Web3Provider>();
    //const {data} = useETHBalance(account);

    useEffect(() => {
        setClicked(false);
        setAmount('');
    }, [])

    useEffect(() => {
        const fetchAmount = async (acc: string) => {
            const amount  = await getTokenBalance?.(graphToken);
            
            setData(formatBalance(amount || '', GRT_DECIMAL));    
         }

        if(account) {

         fetchAmount(account);       
        }
        
    }, [account, chainId])
    const amountError = useMemo(() => !amount && clicked, [amount, clicked]);

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
                <Typography id="amount" variant="h5" component="h2">
                    Delegate Amount:
                </Typography>
                <TextField
                    value={amount}
                    error={amountError}
                    helperText={amountError && "Please enter amount"}
                    type="number"
                    onChange={(e) => {
                        setAmount(e.target.value)
                    }}
                    label="Amount"
                    fullWidth
                />
            </Grid>
            <Grid className={classes.buttonContainer} container spacing={2}>
                <Grid item>
                    <Button size="large" variant="outlined" onClick={() => {
                        setClicked(true);
                        if (!!amount && validator) {
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