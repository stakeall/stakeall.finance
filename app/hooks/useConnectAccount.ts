import {useWeb3React} from "@web3-react/core";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {injected} from "../connectors";
import {UserRejectedRequestError} from "@web3-react/injected-connector";
import { useWeb3ReactWrapper } from "../util";

export const useConnectAccount = () => {
    const {
        active,
        error,
        activate,
        setError,
    } = useWeb3ReactWrapper();

    // initialize metamask onboarding
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        onboarding.current = new MetaMaskOnboarding();
    }, []);

    // manage connecting state for injected connector
    const [connecting, setConnecting] = useState(false);
    useEffect(() => {
        if (active || error) {
            setConnecting(false);
            onboarding.current?.stopOnboarding();
        }
    }, [active, error]);


    const onMetaMaskConnect = useCallback(() => {
        setConnecting(true);

        activate(injected, undefined, true)
            .catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                    setConnecting(false);
                } else {
                    setError(error);
                }
            });
    }, []);

    const hasMetaMaskOrWeb3Available = useMemo(() =>
        typeof window !== "undefined" && (
            MetaMaskOnboarding.isMetaMaskInstalled() ||
            (window as any)?.ethereum ||
            (window as any)?.web3
        ), []);

    const installMetamask = useCallback(() =>
        onboarding.current?.startOnboarding(), [onboarding]);

    return {
        onMetaMaskConnect,
        hasMetaMaskOrWeb3Available,
        installMetamask
    }
}