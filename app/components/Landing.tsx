import React from "react";
import Grid from "@material-ui/core/Grid";
import {Account} from "./Account";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";

const useLandingStyles = makeStyles((theme) =>
    createStyles({
        container: {
            width: '700px',
            margin: '80px auto',
            textAlign: 'center',
            padding: '100px',
            paddingBottom: '80px',
        },
        metamaskContainer: {},
        logo: {
            height: '100px',
            width: '100px',
        }
    })
);

export const Landing: React.FC = () => {
    const classes = useLandingStyles();
    return (
        <>
            <Paper className={classes.container} elevation={2}>
                <Grid container spacing={4} direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h4" color="textPrimary">
                            Manage all your staking needs in one place
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary">
                            STAKEALL is a DeFi Application for staking in various POS protocols. Allows users to borrow from AAVE, swap from 1inch and stake to POS based protocol in a single transaction for earning passive income.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="textSecondary">
                            Connect to metamask to start your journey...
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="secondary">
                            [ For demo use this RPC: http://35.208.215.170:8080 ]
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container direction="column" className={classes.metamaskContainer} alignItems="center"
                  justify="center">
                <Grid item>
                    <img className={classes.logo} src="https://docs.metamask.io/metamask-fox.svg"
                         alt="metamask icon"/>
                </Grid>
                <Grid item>
                    <Account color="secondary"/>
                </Grid>
            </Grid>
        </>
    )
}