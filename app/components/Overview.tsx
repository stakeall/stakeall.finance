import ETHBalance from "./ETHBalance";
import {Grid, Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";

const useOverviewStyles = makeStyles((theme: Theme) =>
    createStyles({
        overviewContainer: {
            height: '400px',
            width: '100%',
        },
    })
)
export const Overview = () => {
    const classes = useOverviewStyles();
    return (
        <Grid component={Paper} className={classes.overviewContainer} container direction="row">
            <ETHBalance/>
        </Grid>
    )
}
