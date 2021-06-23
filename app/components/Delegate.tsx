import {Button} from "@material-ui/core";
import {useBitstake} from "../hooks/useBitstake";
import {useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const amount = "100000000000000000000";

export const Delegate = () => {
    const { delegate, checkIfOnChainWalletExists, deployOnChainWallet } = useBitstake();
    const [indexerId, setIndexerId] = useState('');

    return (
        <Grid container spacing={5} alignItems="center">
            <Grid item>
                <TextField onChange={(e) => {setIndexerId(e.target.value)}} label="Indexer id" />
            </Grid>
            <Grid item>
                <Typography id="modal-modal-title" variant="body1" component="h2">
                    Amount: {amount}
                </Typography>
            </Grid>
            <Grid item>
                <Button variant="outlined" onClick={() => deployOnChainWallet()}> delegate </Button>
            </Grid>
        </Grid>
    );
}