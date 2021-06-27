import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {injected} from "../connectors";
import {UserRejectedRequestError} from "@web3-react/injected-connector";
import {useWeb3React} from "@web3-react/core";

export const useConnectAccount = () => {
    const {
        active,
        error,
        activate,
        setError,
    } = useWeb3React();

    // initialize metamask onboarding
    const onboarding = useRef<MetaMaskOnboarding>();

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