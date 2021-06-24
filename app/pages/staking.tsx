import {Paper, Theme} from "@material-ui/core";
import {useCallback, useContext, useState} from "react";
import {AppCommon} from "../contexts/AppCommon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {DashboardTabLayout} from "../uiComponents/DashboardTabLayout";
import {Overview} from "../components/Overview";
import {Indexers} from "../components/Indexers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";

const useStakingStyles = makeStyles((theme: Theme) =>
    createStyles({
        stakingContainer: {
            margin: '30px',
        },
    })
)

const Staking = () => {
    const classes = useStakingStyles();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
    }, [])
    return (
        <section className={classes.stakingContainer}>
            <Paper elevation={3}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Wallet" />
                    <Tab label="Swap And Stake" />
                    <Tab label="Borrow And Stake" />
                </Tabs>
            </Paper>
            <DashboardTabLayout value={tabValue} index={0}>
                <Overview />
            </DashboardTabLayout>
            <DashboardTabLayout value={tabValue} index={1}>
                <Indexers />
            </DashboardTabLayout>
        </section>
    );
};

export default Staking;