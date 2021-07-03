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
import {isNumeric, shortenHex, truncateMiddle} from "../util";
import { GRT_DECIMAL} from "../constants/contracts";
import {formatBalance, toWei, getTokenByProtocol} from '../util';
import { StakingProtocol } from "../hooks/useBitstake";

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
    const {account, chainId} = useWeb3React<Web3Provider>();
    const {protocol} = useContext(AppCommon);

    const protocolToken = getTokenByProtocol(protocol);

    useEffect(() => {
        setAmount('');
        setAmountError('');
    }, [])

    useEffect(() => {
        const fetchAmount = async () => {
            
            const amount = await getTokenBalance?.(protocolToken.address);
            setData(formatBalance(amount || '', protocolToken.decimal));
        }

        if (account) {
            fetchAmount();
        }

    }, [account, chainId, protocol])

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
                    Validator Id : {truncateMiddle(validator)}
                </Typography>
            </Grid>
            <Grid className={classes.amount}>
                <Typography color="textSecondary" id="balance" variant="body1">
                    Balance: {data} {protocolToken.symbol}
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
                        if (validator && validateAmount()) {
                            delegate?.(validator, toWei(amount, GRT_DECIMAL), protocol || StakingProtocol.GRAPH)
                        }
                    }}>
                        Delegate
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}