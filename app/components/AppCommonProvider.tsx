import React, {useMemo, useState} from "react";
import { AppCommon } from "../contexts/AppCommon";

export const AppCommonProvider: React.FC = ( { children }) => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [validator, setValidator] = useState<string | undefined>();
    const [injectedEth, setInjectedEth] = useState<boolean | undefined>(false);

    const appCommonData = useMemo(() => ({
        pageLoading,
        setPageLoading,
        validator,
        setValidator,
        injectedEth,
        setInjectedEth,
    }), [pageLoading, validator, injectedEth])

    return (
        <AppCommon.Provider value={appCommonData}>
            { children }
        </AppCommon.Provider>
    )
}