import React, {useContext} from "react";
import {AppCommon} from "../contexts/AppCommon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";

const usePageLoaderStyles = makeStyles((theme) =>
    createStyles({
        container: {
            height: '100vh',
            width: '100vw',
        },
    })
)
export const PageLoader: React.FC = ({ children }) => {
    const classes = usePageLoaderStyles();
    const { pageLoading, pageInactive, pageInactiveReason } = useContext(AppCommon);
    if(pageLoading) {
        return (
            <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <CircularProgress size={100} color="secondary"/>
                </Grid>
                <Grid item>
                    <Typography variant="h3" color="secondary">
                        Please wait while we connect your account...
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
                    <Typography variant="body1" color="primary">
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