import React, {useMemo, useState} from "react";
import { AppCommon } from "../contexts/AppCommon";

export const AppCommonProvider: React.FC = ( { children }) => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [validator, setValidator] = useState<string | undefined>();

    const appCommonData = useMemo(() => ({
        pageLoading,
        setPageLoading,
        validator,
        setValidator,
    }), [pageLoading, validator])

    return (
        <AppCommon.Provider value={appCommonData}>
            { children }
        </AppCommon.Provider>
    )
}