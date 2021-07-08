import React, {useContext, useEffect, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {useWeb3React} from "@web3-react/core";
import {Router} from "next/router";
import {Landing} from "./Landing";

const usePageLoaderStyles = makeStyles((theme) =>
    createStyles({
        container: {
            height: '100vh',
            width: '100vw',
        },
        metamaskContainer: {
            height: '300px',
            width: '300px',
            backgroundColor: theme.palette.primary.main,
            margin: '50px auto',
        },
        logo: {
            height: '100px',
            width: '100px',
        }
    })
)
export const PageLoader: React.FC = ({ children }) => {
    const classes = usePageLoaderStyles();
    const { pageLoading, pageInactive, pageInactiveReason } = useContext(AppCommon);
    const { account, error } = useWeb3React();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };

        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    console.log({error});
    if(error) {
        return (
            <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        Unsupported network
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="textSecondary">
                        Please use RPC: http://35.208.215.170:8080
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    if(loading) {
        return (
            <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <CircularProgress size={100} color="primary"/>
                </Grid>
                <Grid item>
                    <Typography variant="h5" color="primary">
                        Please wait while we load...
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    if (!account) {
        return (
            <Landing />
        )
    }

    if(pageLoading) {
        return (
            <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <CircularProgress size={100} color="primary"/>
                </Grid>
                <Grid item>
                   <Typography variant="h5" color="secondary">
                        {pageLoading || 'Please wait while we connect your account...'} 
                    </Typography>
                </Grid>
            </Grid>
        )
    }
    if(pageInactive) {
        return (
            <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <CircularProgress size={100} color="primary"/>
                </Grid>
                <Grid item>
                    <Typography variant="h5" color="primary">
                        Cannot use the site for the following reason
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" color="secondary">
                        {pageInactiveReason}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
    else return (<> {children} </>);
}