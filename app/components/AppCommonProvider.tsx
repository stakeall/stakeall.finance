import React, {useMemo, useState} from "react";
import { AppCommon } from "../contexts/AppCommon";
import {StakingProtocol} from "../hooks/useBitstake";

export const AppCommonProvider: React.FC = ( { children }) => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [pageInactive, setPageInactive] = useState<boolean>(false);
    const [pageInactiveReason, setPageInactiveReason] = useState<string>('');
    const [validator, setValidator] = useState<string | undefined>();
    const [protocol, setProtocol] = useState<StakingProtocol>();
    const [injectedEth, setInjectedEth] = useState<boolean | undefined>(false);

    const appCommonData = useMemo(() => ({
        pageLoading,
        setPageLoading,
        validator,
        setValidator,
        protocol,
        setProtocol,
        injectedEth,
        setInjectedEth,
        pageInactive,
        setPageInactive,
        pageInactiveReason,
        setPageInactiveReason,
    }), [pageLoading, validator, injectedEth, pageInactive, pageInactiveReason, protocol])

    return (
        <AppCommon.Provider value={appCommonData}>
            { children }
        </AppCommon.Provider>
    )
}