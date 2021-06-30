import {useCallback, useState} from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Overview} from "./Overview";
import {DashboardTabLayout} from "../uiComponents/DashboardTabLayout";
import {Paper, Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Indexers} from "./Indexers";

const useDashboardStyles = makeStyles((theme: Theme) =>
    createStyles({
        dashboard: {
            margin: '30px',
        },
    })
)

export const Dashboard = () => {
    const classes = useDashboardStyles();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
    }, [])
    return (
        <section className={classes.dashboard}>
            <Paper elevation={3}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Staking" />
                </Tabs>
            </Paper>
            <DashboardTabLayout value={tabValue} index={0}>
                <Overview />
            </DashboardTabLayout>
            <DashboardTabLayout value={tabValue} index={1}>
                <Indexers />
            </DashboardTabLayout>
        </section>
    )
}
