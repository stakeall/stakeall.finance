import MetaMaskOnboarding from "@metamask/onboarding";
import Button, {ButtonProps} from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {useConnectAccount} from "../hooks/useConnectAccount";
import {OnChain} from "./OnChain";
import {AccountId} from "./AccountId";
import React, {useContext} from "react";
import {Bitstake} from "../contexts/Bitstake";
import {useWeb3React} from "@web3-react/core";

interface AccountProps {
    color?: ButtonProps['color'],
}

const useAccountStyles = (color: AccountProps['color']) => makeStyles((theme) =>
    createStyles({
        container: {},
        button: {
            color: !color ? theme.palette.primary.contrastText: undefined,
            borderColor: !color ? theme.palette.primary.contrastText: undefined,
        }
    })
)

export const Account: React.FC<AccountProps> = ({color}) => {
    const classes = useAccountStyles(color)();
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
                color={color}
            >
                {MetaMaskOnboarding.isMetaMaskInstalled()
                    ? "Connect to MetaMask" // using RPC http://35.208.215.170:8080
                    : "Connect to Wallet"}
            </Button>
        ) : (
            <Button
                className={classes.button}
                onClick={installMetamask}
                color={color}
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

