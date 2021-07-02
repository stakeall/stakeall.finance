import React, {useCallback, useMemo, useState} from "react";
import { AppCommon } from "../contexts/AppCommon";

export const AppCommonProvider: React.FC = ( { children }) => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [pageInactive, setPageInactive] = useState<boolean>(false);
    const [pageInactiveReason, setPageInactiveReason] = useState<string>('');
    const [validator, setValidator] = useState<string | undefined>();
    const [injectedEth, setInjectedEth] = useState<boolean | undefined>(false);

    const appCommonData = useMemo(() => ({
        pageLoading,
        setPageLoading,
        validator,
        setValidator,
        injectedEth,
        setInjectedEth,
        pageInactive,
        setPageInactive,
        pageInactiveReason,
        setPageInactiveReason,
    }), [pageLoading, validator, injectedEth, pageInactive, pageInactiveReason])

    return (
        <AppCommon.Provider value={appCommonData}>
            { children }
        </AppCommon.Provider>
    )
}