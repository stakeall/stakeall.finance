import React, {useContext, useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {BorrowTable} from "./BorrowTable";
import Paper from "@material-ui/core/Paper";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {shortenHex} from "../util";

const useBorrowSwapAndStakeStyles = makeStyles((theme) =>
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



export const BorrowSwapAndStake = () => {
    const classes = useBorrowSwapAndStakeStyles();
    const [borrowerId, setBorrowerId] = useState<string>('');

    if(!borrowerId) {
        return <BorrowTable setBorrowerId={setBorrowerId} />
    }
    return (
        <Paper className={classes.container}>
            <Grid container spacing={4} direction="column">
                <Grid className={classes.validator}>
                    <Typography variant="body1" color="secondary" id="modal-modal-description">
                        Borrower Id : {shortenHex(borrowerId)}
                    </Typography>
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


