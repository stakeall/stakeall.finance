import {Grid, Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {Assets} from "./Assets";

const useOverviewStyles = makeStyles((theme: Theme) =>
    createStyles({
        overviewContainer: {
            width: '100%',
        },
    })
)
export const Overview = () => {
    const classes = useOverviewStyles();
    return (
        <Grid component={Paper} className={classes.overviewContainer} container direction="row">
            <Assets />
        </Grid>
    )
}
