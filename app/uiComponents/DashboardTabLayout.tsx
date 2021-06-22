import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";

interface DashboardTabLayoutProps {
    value: number,
    index: number,
}

const useDashboardLayoutStyles = makeStyles((theme: Theme) =>
    createStyles({
        tabArea: {
        },
    })
)

export const DashboardTabLayout: React.FC<DashboardTabLayoutProps> = ({children, value, index, ...other}) => {
    const classes = useDashboardLayoutStyles();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid className={classes.tabArea} container alignItems="center" justify="center" direction="column">
                    {children}
                </Grid>
            )}
        </div>
    );
}
