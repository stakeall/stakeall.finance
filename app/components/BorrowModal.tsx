import React, {useCallback, useContext, useMemo, useState} from "react";
import {Modal} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Bitstake} from "../contexts/Bitstake";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {graphToken} from "../constants/contracts";
import {BN} from "ethereumjs-util";
import TextField from "@material-ui/core/TextField";
import {ContractMap} from "../constants/contractMap";
import {shortenHex} from "../util";

export interface BorrowModalProps {
    open: boolean,
    handleClose: VoidFunction,
    borrowDetails: {
        validator?: string,
        depositTokenDetails?: ContractMap[string],
        depositAmount?: string,
        borrowTokenDetails?: ContractMap[string],
        borrowerId?: string,
    },
}


const useBorrowModalStyles = makeStyles((theme) => createStyles({
    modalContainer: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: '24px',
        padding: 40,
    },
    buttonContainer: {
        padding: 20,
    }
}));

export const BorrowModal: React.FC<BorrowModalProps> = ({open, handleClose, borrowDetails}) => {
    const classes = useBorrowModalStyles();
    const [rateMode, setRateMode] = useState<string>('');
    const [borrowAmount, setBorrowAmount] = useState<string>('');
    const {borrowSwapAndStake} = useContext(Bitstake);
    const {
        validator,
        depositTokenDetails,
        depositAmount,
        borrowTokenDetails,
        borrowerId,
    } = useMemo(() => borrowDetails, [borrowDetails]);

    const handleBorrow = useCallback(() => {
        borrowSwapAndStake?.(
            validator || '',
            (depositTokenDetails && depositTokenDetails.id) || '',
            graphToken,
            new BN(depositAmount || '')
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
            borrowerId || '',
            rateMode
        )
    }, [validator, depositTokenDetails, depositAmount, borrowAmount, borrowTokenDetails, borrowerId, rateMode]);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalContainer}>
                <Grid container spacing={2} direction="column">
                    <Typography id="modal-modal-title" variant="h5" component="h2" color="primary">
                        Confirm Borrow and Stake
                    </Typography>
                    <Grid item>
                        <Typography variant="body1" component="h2">
                            Validator Id: {shortenHex(validator)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" component="h2">
                            Deposit Token: {depositTokenDetails?.symbol}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" component="h2">
                            Deposit Amount: {depositAmount}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" component="h2">
                            Borrower Token: {borrowTokenDetails?.symbol}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="number"
                            value={borrowAmount}
                            onChange={(e) => {
                                setBorrowAmount(e.target.value)
                            }}
                            label="Borrow Amount"
                        />
                    </Grid>
                    <Grid className={classes.buttonContainer} container justify="flex-start" spacing={2}>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Rate mode</FormLabel>
                                <RadioGroup
                                    aria-label="Interest Rate Type"
                                    name="rateMode"
                                    value={rateMode}
                                    onChange={(e) => {
                                        setRateMode(e.target.value);
                                    }}>
                                    <FormControlLabel value="1" control={<Radio/>} label="Stable"/>
                                    <FormControlLabel value="2" control={<Radio/>} label="Variable"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleBorrow}
                        >
                            Borrow and Stake
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}