import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Button from "@material-ui/core/Button";
import {graphToken} from "../constants/contracts";
import {createMetamaskTokenUrl, shortenHex} from "../util";
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
    const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
    const [tokenDetails, setTokenDetails] = useState<ContractMap[string]>();

    useEffect(() => {
        const token = Object.values(contractMap).find(token => token.name === selectedToken);
        setTokenDetails(token);
    }, [selectedToken])

    const handleTokenChange = useCallback((name: string) => {
        setSelectedToken(name);
    }, []);

    useEffect(() => {

        const getEstimate = async () => {
            const [whole, fractional] = amount.split('.');
            const wholeBN = new BN(whole);
            const fractionalBN = new BN(fractional);
            const decimalsBN = new BN(tokenDetails?.decimals || 1);
            const tenBN = new BN(10)
            const fractionalLengthBN = new BN(fractional?.length || 1);

            const convertedAmount =
                wholeBN
                    .mul(tenBN
                        .pow(fractionalLengthBN)
                    )
                    .add(fractionalBN)
                    .mul(tenBN
                        .pow(decimalsBN
                            .sub(fractionalLengthBN)
                        )
                    )

            const estimated = await getEstimatedSwapAmount?.(tokenDetails?.id || '', graphToken, convertedAmount.toString());
            const convertedEstimated = new BN(estimated || '').div(new BN(10).pow(new BN(tokenDetails?.decimals || 1)));
            setEstimatedAmount(convertedEstimated.toString() || '');
        }
        if (amount && tokenDetails) {
            getEstimate();
        }
    }, [amount, tokenDetails]);

    return (
        <>
            <Paper className={classes.container}>
                <Grid container spacing={4} direction="column">
                    <Grid className={classes.validator}>
                        <Typography variant="body1" color="secondary" id="modal-modal-description">
                            Validator Id : {shortenHex(validator)}
                        </Typography>
                    </Grid>
                    <SelectToken tokenDetails={tokenDetails} handleTokenChange={handleTokenChange}/>
                    <Grid item>
                        <TextField
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value)
                            }}
                            label="Amount"
                        />
                    </Grid>
                    <Grid item>
                        <Grid item alignItems="center">
                            <Typography variant="body1" color="textPrimary">
                                Estimated: {estimatedAmount} GRT
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                swapAndStake?.(
                                    validator || '',
                                    tokenDetails?.id || '',
                                    toWei(amount, tokenDetails?.decimals || 18),
                                )
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