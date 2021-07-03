import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Borrower, BorrowTable} from "./BorrowTable";
import Paper from "@material-ui/core/Paper";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {isNumeric, shortenHex, truncateMiddle} from "../util";
import {SelectToken} from "./SelectToken";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {toChecksumAddress} from "ethereumjs-util";
import {AppCommon} from "../contexts/AppCommon";
import {contractMap, ContractMap} from "../constants/contractMap";
import {BorrowModal, BorrowModalProps} from "./BorrowModal";
import {dep} from "optimism";

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
    const [borrower, setBorrower] = useState<Borrower>();
    const {validator} = useContext(AppCommon);
    const [depositToken, setDepositToken] = useState<string>('Ethereum');
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [depositAmountError, setDepositAmountError] = useState<string>('');
    const [depositTokenDetails, setDepositTokenDetails] = useState<ContractMap[string]>();
    const [showBorrowTable, setShowBorrowTable] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const borrowTokenDetails = useMemo(() => {
        const x = toChecksumAddress(borrower?.underlyingAsset || '');
        return contractMap[x];
    }, [borrower]);

    const modalBorrowDetails: BorrowModalProps['borrowDetails'] = useMemo(() => ({
        borrower,
        borrowTokenDetails,
        depositAmount,
        depositTokenDetails,
        validator,
    }), [
        borrower,
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

    const validateDepositAmount = useCallback(() => {
        if(!isNumeric(depositAmount)) {
            setDepositAmountError('Enter valid amount')
            return false;
        }
        return true;
    }, [depositAmount]);

    return (
        <Grid container direction="column" spacing={8} alignItems="center">
            <Paper className={classes.container}>
                <Grid item container spacing={4} direction="column" alignItems="center" justify="center">
                    <Grid container direction="row" spacing={4} alignItems="center" justify="center">
                        <SelectToken tokenDetails={depositTokenDetails} handleTokenChange={handleTokenChange}/>
                        <Grid item>
                            <TextField
                                type="number"
                                value={depositAmount}
                                error={depositAmountError !== ''}
                                helperText={depositAmountError}
                                onChange={(e) => {
                                    setDepositAmountError('');
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
                                    if(validateDepositAmount()){
                                        setShowBorrowTable(true);
                                    }
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
                            setBorrower={(borrower) => {
                                setBorrower(borrower);
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


