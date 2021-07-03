import React, {useContext} from "react";
import Switch from "@material-ui/core/Switch";
import {AppCommon} from "../contexts/AppCommon";
import Typography from "@material-ui/core/Typography";
import Brightness3Icon from '@material-ui/icons/Brightness3';

export const NightModeSwitch: React.FC = () => {
    const {nightMode, setNightMode} = useContext(AppCommon);
    return (
            <Switch
                checked={nightMode}
                onChange={(event, checked) => {
                    setNightMode?.(checked)
                }}
                name="checkedA"
                inputProps={{'aria-label': 'secondary checkbox'}}
                color="default"
            />
    )
}