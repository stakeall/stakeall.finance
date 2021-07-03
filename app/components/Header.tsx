import {AppBar, Button, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Account} from "./Account";
import {ClientOnly} from "./ClientOnly";
import Link from "next/link";
import {NightModeSwitch} from "./NightModeSwitch";

const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            paddingLeft: theme.spacing(6),
        },
        logoImg: {
            paddingRight: theme.spacing(2),
            height: '60px',
            width: '300px',
            objectFit: 'contain',
        },
        accountId: {
            minWidth: '250px',
            padding: theme.spacing(2),
        },
        buttonContainer: {
          width: 'auto',
        },
        button: {
            color: theme.palette.primary.contrastText,
        }
    })
)
export const Header = () => {
    const classes = useHeaderStyles();
    return (
        <ClientOnly>
            <AppBar position="relative">
                <Grid className={classes.title} container justify="space-between" alignItems="center" wrap="nowrap">
                    <Grid alignItems="center">
                        <Link href="/">
                            <Button className={classes.button} size="large" >
                                <img className={classes.logoImg} src="textLogo.svg" alt="logo"/>
                            </Button>
                        </Link>
                    </Grid>
                    <Grid className={classes.buttonContainer} direction="row" container item alignItems="center" wrap="nowrap">
                        <Grid item>
                            <NightModeSwitch />
                        </Grid>
                        <Grid item className={classes.accountId} >
                            <Account />
                        </Grid>
                    </Grid>
                </Grid>
            </AppBar>
        </ClientOnly>
    )
}