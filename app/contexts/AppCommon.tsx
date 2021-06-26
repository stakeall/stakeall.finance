import React from "react";

interface AppCommonData {
    pageLoading: boolean,
    setPageLoading: (loading: boolean) => void,
    validator: string,
    setValidator: (validator: string) => void,
    injectedEth: boolean,
    setInjectedEth: (injected: boolean) => void,
}

export const AppCommon = React.createContext<Partial<AppCommonData>>({});