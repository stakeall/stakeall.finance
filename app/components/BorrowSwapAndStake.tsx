import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {BorrowTable} from "./BorrowTable";
import Paper from "@material-ui/core/Paper";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {shortenHex} from "../util";
import {SelectToken} from "./SelectToken";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {BN} from "ethereumjs-util";
import {Bitstake} from "../contexts/Bitstake";
import {AppCommon} from "../contexts/AppCommon";
import {contractMap, ContractMap} from "../constants/contractMap";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {graphToken} from "../constants/contracts";

const useBorrowSwapAndStakeStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: '50px',
            margin: '50px',
        },
        buttonContainer: {},
        validator: {
            padding: theme.spacing(5),
        },
    })
)


export const BorrowSwapAndStake = () => {
    const classes = useBorrowSwapAndStakeStyles();
    const [borrowerId, setBorrowerId] = useState<string>('');
    const {borrowSwapAndStake} = useContext(Bitstake);
    const {validator} = useContext(AppCommon);
    const [depositToken, setDepositToken] = useState<string>('Ethereum');
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [borrowAmount, setBorrowAmount] = useState<string>('1');
    const [rateMode, setRateMode] = useState<string>('1');
    const [depositTokenDetails, setDepositTokenDetails] = useState<ContractMap[string]>();

    useEffect(() => {
        const token = Object.values(contractMap).find(token => token.name === depositToken);
        setDepositTokenDetails(token);
    }, [depositToken])

    const borrowTokenDetails = useMemo(() => {
        return Object.values(contractMap).find(token => token.id === borrowerId)
    }, []);

    const handleTokenChange = useCallback((name: string) => {
        setDepositToken(name);
    }, []);

    if (!borrowerId) {
        return <BorrowTable setBorrowerId={setBorrowerId}/>
    }
    return (
        <Paper className={classes.container}>
            <Grid container spacing={4} direction="column">
                <Grid className={classes.validator}>
                    <Typography variant="body1" color="secondary" id="modal-modal-description">
                        Validator Id : {shortenHex(validator)}
                    </Typography>
                </Grid>
                <SelectToken tokenDetails={depositTokenDetails} handleTokenChange={handleTokenChange}/>
                <Grid item>
                    <TextField
                        type="number"
                        value={depositAmount}
                        onChange={(e) => {
                            setDepositAmount(e.target.value)
                        }}
                        placeholder="Deposit Amount"
                    />
                </Grid>
                <Grid item>
                    <Typography variant="body1" color="secondary" id="modal-modal-description">
                        Borrow Amount : {borrowAmount}
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Rate mode</FormLabel>
                        <RadioGroup
                            aria-label="Rate mode"
                            name="rateMode"
                            value={rateMode}
                            onChange={(e) => {
                                setRateMode(e.target.value);
                            }}>
                            <FormControlLabel value="1" control={<Radio/>} label="1"/>
                            <FormControlLabel value="2" control={<Radio/>} label="2"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            borrowSwapAndStake?.(
                                validator || '',
                                depositTokenDetails.id || '',
                                graphToken,
                                new BN(depositAmount)
                                    .mul(
                                        new BN(10)
                                            .pow(
                                                new BN(depositTokenDetails?.decimals || 1)
                                            )
                                    ).toString(),
                                new BN(borrowAmount)
                                    .mul(
                                        new BN(10)
                                            .pow(
                                                new BN(borrowTokenDetails?.decimals || 1)
                                            )
                                    ).toString(),
                                borrowerId,
                                rateMode
                            )
                        }}
                    >
                        Borrow and Delegate
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

/**
 * borrow asset .. underlyingAsset.. name
 * borrow intereset rate
 * borrow amount
 * swap amount
 */


