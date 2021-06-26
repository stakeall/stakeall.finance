import {Theme} from "@material-ui/core";
import {Dashboard} from "../components/Dashboard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {ClientOnly} from "../components/ClientOnly";
import {InjectWeb3} from "../components/InjectWeb3";

const useBackgroundStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainArea: {
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
            margin: 0,
            padding: 0,
        },
    })
)

export default function Home() {
    const classes = useBackgroundStyles();
    return (
        <ClientOnly>
            <InjectWeb3/>
            <Paper
                component="main"
                elevation={0}
                square
                className={classes.mainArea}
            >
                <Dashboard/>
            </Paper>
        </ClientOnly>
    );
}
