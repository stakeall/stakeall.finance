import MetaMaskOnboarding from "@metamask/onboarding";
import {useWeb3React} from "@web3-react/core";
import Button from "@material-ui/core/Button";
import {Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import {useConnectAccount} from "../hooks/useConnectAccount";

type Props = {
    triedToEagerConnect: boolean;
};

const useAccountStyles = makeStyles(() =>
    createStyles({
        container: {
            height: '50px',
        },
    })
)

export const Account = ({triedToEagerConnect}: Props) => {
    const classes = useAccountStyles();
    const { account, error } = useWeb3React();
    const { hasMetaMaskOrWeb3Available, onMetaMaskConnect, installMetamask} = useConnectAccount();

        if (error) {
        return null;
    }

    if (!triedToEagerConnect) {
        return null;
    }

    if (typeof account !== "string") {
        return (
                <Grid className={classes.container} container justify="center" alignItems="center">
                    {hasMetaMaskOrWeb3Available ? (
                        <Button
                            color="primary"
                            onClick={onMetaMaskConnect}
                            variant="outlined"
                        >
                            {MetaMaskOnboarding.isMetaMaskInstalled()
                                ? "Connect to MetaMask"
                                : "Connect to Wallet"}
                        </Button>
                    ) : (
                        <Button onClick={installMetamask}>
                            Install Metamask
                        </Button>
                    )}
                </Grid>
        );
    }
    return null;
};

