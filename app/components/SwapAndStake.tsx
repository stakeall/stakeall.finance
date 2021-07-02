import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Button from "@material-ui/core/Button";
import {graphToken} from "../constants/contracts";
import {createMetamaskTokenUrl, getBN, getTokenByProtocol, isNumeric, shortenHex, truncateMiddle} from "../util";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {TokenSelectionModal} from "./TokenSelectionModal";
import {ContractMap, contractMap} from "../constants/contractMap";
import TextField from "@material-ui/core/TextField";
import {Bitstake} from "../contexts/Bitstake";
import {AppCommon} from "../contexts/AppCommon";
import {BN} from "ethereumjs-util";
import {SelectToken} from "./SelectToken";
import {toWei} from '../util';

const useSwapAndStakeStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: '50px',
            margin: '50px',
        },
        buttonContainer: {
        },
        validator: {
            padding: theme.spacing(5),
        },
    })
)


export const SwapAndStake = () => {
    const classes = useSwapAndStakeStyles();
    const {swapAndStake, getEstimatedSwapAmount} = useContext(Bitstake);
    const {validator} = useContext(AppCommon);
    const [selectedToken, setSelectedToken] = useState<string>('Ethereum');
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<string>('');
    const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
    const [tokenDetails, setTokenDetails] = useState<ContractMap[string]>();
    const { protocol } = useContext(AppCommon);
    const protocolToken = getTokenByProtocol(protocol);

    useEffect(() => {
        const token = Object.values(contractMap).find(token => token.name === selectedToken);
        setTokenDetails(token);
    }, [selectedToken])

    const handleTokenChange = useCallback((name: string) => {
        setSelectedToken(name);
    }, []);

    useEffect(() => {
        const getEstimate = async () => {
            const convertedAmount = getBN(amount, tokenDetails?.decimals || 1)
            const estimated = await getEstimatedSwapAmount?.(tokenDetails?.id || '', protocolToken.address, convertedAmount.toString());
            const convertedEstimated = new BN(estimated || '').div(new BN(10).pow(new BN(tokenDetails?.decimals || 1)));
            setEstimatedAmount(convertedEstimated.toString() || '');
        }
        if (amount && tokenDetails) {
            getEstimate();
        }
    }, [amount, tokenDetails]);

    const validateAmount = useCallback(() => {
        if(!isNumeric(amount)) {
            setAmountError('Enter valid amount')
            return false;
        }
        return true;
    }, [amount]);

    return (
        <>
            <Paper className={classes.container}>
                <Grid container spacing={4} direction="column">
                    <Grid className={classes.validator}>
                        <Typography variant="body1" color="secondary" id="modal-modal-description">
                            Validator Id : {truncateMiddle(validator)}
                        </Typography>
                    </Grid>
                    <SelectToken tokenDetails={tokenDetails} handleTokenChange={handleTokenChange}/>
                    <Grid item>
                        <TextField
                            type="number"
                            value={amount}
                            error={amountError !== ''}
                            helperText={amountError}
                            onChange={(e) => {
                                setAmountError('');
                                setAmount(e.target.value)
                            }}
                            label="Amount"
                        />
                    </Grid>
                    <Grid item>
                        <Grid item alignItems="center">
                            <Typography variant="body1" color="textPrimary">
                                Estimated: {estimatedAmount} {protocolToken.symbol}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                if(validateAmount()){
                                    swapAndStake?.(
                                        validator || '',
                                        tokenDetails?.id || '',
                                        toWei(amount, tokenDetails?.decimals || 18),
                                    )
                                }
                            }}
                        >
                            Delegate
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
};