import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {useWeb3React} from "@web3-react/core";
import usePersonalSign from "../hooks/usePersonalSign";
import {verifyMessage} from "@ethersproject/wallet";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import { useWeb3ReactWrapper } from "../util";

const usePersonalSignStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: '100px',
            margin: theme.spacing(2, 0),
        },
    })
)

export const PersonalSign = () => {
    const classes = usePersonalSignStyles();
    const { account } = useWeb3ReactWrapper();
    const sign = usePersonalSign();

    const handleSign = async () => {
        const msg = "BitStake custom message";

        const sig = await sign(msg);

        console.log(sig);

        console.log("isValid", verifyMessage(msg, sig) === account);
    };

    return (
        <Paper>
            <Grid className={classes.container} container direction="column" alignItems="center" justify="center">
                <Button onClick={handleSign} color="secondary" variant="outlined">Personal Sign</Button>
            </Grid>
        </Paper>
    )
}