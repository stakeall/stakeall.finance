import React, {useContext} from "react"

import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core/styles"
import {themeLight, themeDark} from "../theme/themeConfig2";
import {AppCommon} from "../contexts/AppCommon";

const Layout: React.FC = ({ children }) => {
    const { nightMode } = useContext(AppCommon);
    return (
        <ThemeProvider theme={nightMode ? themeDark : themeLight}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default Layout