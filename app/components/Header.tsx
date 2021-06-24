import {AppBar, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Account} from "./Account";
import {useWeb3React} from "@web3-react/core";
import {ClientOnly} from "./ClientOnly";

const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            padding: theme.spacing(2),
        },
        accountId: {
            padding: theme.spacing(2),
        },
    })
)
export const Header = () => {
    const classes = useHeaderStyles();
    return (
        <ClientOnly>
            <AppBar position="relative">
                <Grid className={classes.title} container justify="space-between" alignItems="center">
                    <Grid>
                        <Typography variant="h5" color="textPrimary">
                            BitStake
                        </Typography>
                    </Grid>
                    <Grid className={classes.accountId}>
                        <Account />
                    </Grid>
                </Grid>
            </AppBar>
        </ClientOnly>
    )
}