import {Paper, Theme} from "@material-ui/core";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {DashboardTabLayout} from "../uiComponents/DashboardTabLayout";
import {Overview} from "../components/Overview";
import {GraphIndexers} from "../components/GraphIndexers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {WalletStake} from "../components/WalletStake";
import {useRouter} from "next/router";
import {SwapAndStake} from "../components/SwapAndStake";
import {BorrowSwapAndStake} from "../components/BorrowSwapAndStake";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {truncateMiddle} from "../util";
import {StakeCards} from "../components/StakeCards";

const useStakingStyles = makeStyles((theme: Theme) =>
    createStyles({
        infoContainer: {
            padding: '50px'
        },
        infoItem: {
            width: 'auto'
        },
        infoTitle: {
            marginRight: theme.spacing(2)
        },
    })
)

const Staking = () => {
    const classes = useStakingStyles();
    const [tabValue, setTabValue] = useState(3);
    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
    }, [])
    const {validator, protocol} = useContext(AppCommon);
    const router = useRouter();

    useEffect(() => {
        if (!validator) {
            router.push('/');
        }
    }, [validator]);

    return (
        <section>
            <Paper elevation={3}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Wallet"/>
                    <Tab label="Swap And Stake"/>
                    <Tab label="Borrow And Stake"/>
                </Tabs>
            </Paper>
            <Grid alignItems="center" justify="center" className={classes.infoContainer} container direction="row" spacing={6}>
                <Grid className={classes.infoItem} container item direction="row" wrap="nowrap">
                    <Grid item>
                        <Typography className={classes.infoTitle} variant="body1" color="textSecondary">
                            Validator Id:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textPrimary">
                            {truncateMiddle(validator)}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.infoItem} container item direction="row" wrap="nowrap">
                    <Grid item>
                        <Typography className={classes.infoTitle} variant="body1" color="textSecondary">
                            Protocol:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textPrimary">
                            {protocol}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <DashboardTabLayout value={tabValue} index={0}>
                <WalletStake/>
            </DashboardTabLayout>
            <DashboardTabLayout value={tabValue} index={1}>
                <SwapAndStake/>
            </DashboardTabLayout>
            <DashboardTabLayout value={tabValue} index={2}>
                <BorrowSwapAndStake/>
            </DashboardTabLayout>
            <DashboardTabLayout value={tabValue} index={3}>
                <StakeCards onSelect={setTabValue}/>
            </DashboardTabLayout>
        </section>
    );
};

export default Staking;