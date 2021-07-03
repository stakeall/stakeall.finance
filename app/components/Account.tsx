import MetaMaskOnboarding from "@metamask/onboarding";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {useConnectAccount} from "../hooks/useConnectAccount";
import {OnChain} from "./OnChain";
import {AccountId} from "./AccountId";
import {useContext} from "react";
import {Bitstake} from "../contexts/Bitstake";
import {useWeb3React} from "@web3-react/core";

const useAccountStyles = makeStyles((theme) =>
    createStyles({
        container: {},
        button: {
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.contrastText,
        }
    })
)

export const Account = () => {
    const classes = useAccountStyles();
    const {account, error} = useWeb3React()
    const {hasMetaMaskOrWeb3Available, onMetaMaskConnect, installMetamask} = useConnectAccount();
    const {
        onChainWalletAddressExists,
    } = useContext(Bitstake);

    if (error) {
        return null;
    }

    if (typeof account !== "string") {
        return hasMetaMaskOrWeb3Available ? (
            <Button
                className={classes.button}
                onClick={onMetaMaskConnect}
                variant="outlined"
            >
                {MetaMaskOnboarding.isMetaMaskInstalled()
                    ? "Connect to MetaMask" // using RPC http://35.208.215.170:8080
                    : "Connect to Wallet"}
            </Button>
        ) : (
            <Button
                className={classes.button}
                onClick={installMetamask}
            >
                Install Metamask
            </Button>
        )
    }
    else if(!onChainWalletAddressExists) {
        return <OnChain />
    }
    else {
        return <AccountId />
    }
};

