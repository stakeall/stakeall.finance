import React from "react";
import {StakingProtocol} from "../hooks/useBitstake";

interface AppCommonData {
    pageLoading: string,
    setPageLoading: (loading: string, metamaskDisconnected?: boolean) => void,
    validator: string,
    setValidator: (validator: string) => void,
    protocol: StakingProtocol,
    setProtocol: (protocol: StakingProtocol | undefined) => void,
    injectedEth: boolean,
    setInjectedEth: (injected: boolean) => void,
    pageInactive: boolean,
    setPageInactive: (active: boolean) => void,
    pageInactiveReason: string,
    setPageInactiveReason: (reason: string) => void,
    nightMode: boolean,
    setNightMode: (nightMode: boolean) => void,
}

export const AppCommon = React.createContext<Partial<AppCommonData>>({});