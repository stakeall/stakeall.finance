import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import {createMuiTheme} from "@material-ui/core/styles";

export const themeOptions: ThemeOptions = {
    palette: {
        type: 'dark',
        primary: {
            main: '#2d8a64',
        },
        secondary: {
            main: '#d6d65d',
        },
        background: {
            default: '#161c16',
            paper: '#212d26',
        },
        error: {
            main: '#ec6c6b',
        },
        info: {
            main: '#c721f3',
        },
    },
    typography: {
        fontFamily: 'Lato',
        fontSize: 16,
    },
    props: {
        MuiButton: {
            size: 'small',
        },
        MuiButtonGroup: {
            size: 'small',
        },
        MuiCheckbox: {
            size: 'small',
        },
        MuiFab: {
            size: 'small',
        },
        MuiFormControl: {
            margin: 'dense',
            size: 'small',
        },
        MuiFormHelperText: {
            margin: 'dense',
        },
        MuiIconButton: {
            size: 'small',
        },
        MuiInputBase: {
            margin: 'dense',
        },
        MuiInputLabel: {
            margin: 'dense',
        },
        MuiRadio: {
            size: 'small',
        },
        MuiSwitch: {
            size: 'small',
        },
        MuiTextField: {
            margin: 'dense',
            size: 'small',
        },
        MuiList: {
            dense: true,
        },
        MuiMenuItem: {
            dense: true,
        },
        MuiTable: {
            size: 'small',
        },
        MuiTooltip: {
            arrow: true,
        },
    },
};

export const theme = createMuiTheme(themeOptions);