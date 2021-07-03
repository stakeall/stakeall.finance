import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const themeOptions: ThemeOptions = {
    palette: {
        type: 'light',
        primary: {
            main: '#2e94ad',
        },
        secondary: {
            main: '#06a2b1',
        },
        error: {
            main: '#f44336',
        },
        info: {
            main: '#2196f3',
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
export const themeLight = createMuiTheme(themeOptions);
export const themeDark = createMuiTheme({
    ...themeOptions,
    palette: {
        ...themeOptions.palette,
        type: 'dark',
    }
});
