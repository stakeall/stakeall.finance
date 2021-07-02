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
import {toChecksumAddress} from "ethereumjs-util";
import {AppCommon} from "../contexts/AppCommon";
import {contractMap, ContractMap} from "../constants/contractMap";
import {BorrowModal, BorrowModalProps} from "./BorrowModal";

const useBorrowSwapAndStakeStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: '50px',
            margin: '50px',
        },
        table: {
            width: '100%',
            padding: '50px',
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
    const {validator} = useContext(AppCommon);
    const [depositToken, setDepositToken] = useState<string>('Ethereum');
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [depositTokenDetails, setDepositTokenDetails] = useState<ContractMap[string]>();
    const [showBorrowTable, setShowBorrowTable] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const borrowTokenDetails = useMemo(() => {
        const x = toChecksumAddress(borrowerId);
        console.log({x});
        return contractMap[x];
    }, [borrowerId]);

    const modalBorrowDetails: BorrowModalProps['borrowDetails'] = useMemo(() => ({
        borrowerId,
        borrowTokenDetails,
        depositAmount,
        depositTokenDetails,
        validator,
    }), [
        borrowerId,
        borrowTokenDetails,
        depositAmount,
        depositTokenDetails,
        validator,
    ]);

    useEffect(() => {
        const token = Object.values(contractMap).find(token => token.name === depositToken);
        setDepositTokenDetails(token);
    }, [depositToken])

    const handleTokenChange = useCallback((name: string) => {
        setShowBorrowTable(false);
        setDepositToken(name);
    }, []);

    return (
        <Grid container direction="column" spacing={8} alignItems="center">
            <Paper className={classes.container}>
                <Grid item container spacing={4} direction="column" alignItems="center" justify="center">
                    <Grid className={classes.validator}>
                        <Typography variant="body1" color="secondary" id="modal-modal-description">
                            Validator Id : {shortenHex(validator)}
                        </Typography>
                    </Grid>
                    <Grid container direction="row" spacing={4} alignItems="center" justify="center">
                        <SelectToken tokenDetails={depositTokenDetails} handleTokenChange={handleTokenChange}/>
                        <Grid item>
                            <TextField
                                type="number"
                                value={depositAmount}
                                onChange={(e) => {
                                    setShowBorrowTable(false);
                                    setDepositAmount(e.target.value)
                                }}
                                label="Deposit Amount"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    setShowBorrowTable(true);
                                }}
                            >
                                Estimate
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            {showBorrowTable && (
                <Paper className={classes.table}>
                    <Grid item container spacing={4} direction="column">
                        <BorrowTable
                            setBorrowerId={(id) => {
                                setBorrowerId(id);
                                setModalOpen(true);
                            }}
                            borrowDetails={modalBorrowDetails}
                        />
                    </Grid>
                </Paper>
            )}
            <BorrowModal
                open={modalOpen}
                handleClose={() => { setModalOpen(false) }}
                borrowDetails={modalBorrowDetails}
            />
        </Grid>
    );
};


