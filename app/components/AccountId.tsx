import {useContext, useState, MouseEvent, useCallback} from "react";
import {shortenHex} from "../util";
import useENSName from "../hooks/useENSName";
import {Typography} from "@material-ui/core";
import {Bitstake} from "../contexts/Bitstake";
import {useWeb3React} from "@web3-react/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

const useAccountIdStyles = makeStyles((theme) =>
    createStyles({
        menuContainer: {
            padding: theme.spacing(2),
            width: 400,
            height: '100%',
        },
        menuItem: {
            padding: theme.spacing(2),
        },
        menuItemDetails: {
            paddingRight: 40,
        },
    })
)
export const AccountId = () => {
    const classes = useAccountIdStyles();
    const {
        account,
    } = useWeb3React();
    const {onChainWalletAddress} = useContext(Bitstake);

    const ENSName = useENSName(account);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const copy = useCallback((text) => () => {
        navigator.clipboard.writeText(text);
    }, [])
    return (
        <>
            <Button variant="outlined" size="large" onClick={handleClick}>
                Account
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorReference="anchorEl"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Grid className={classes.menuContainer}>
                    <Grid className={classes.menuItem} container direction="column" spacing={2}>
                        <Typography variant="body1" color="textPrimary">
                            Address
                        </Typography>
                        <Grid className={classes.menuItemDetails} container item direction="row" justify="center" spacing={2}>
                            <Grid item>
                                <Typography variant="body2" color="secondary">
                                    {ENSName || `${shortenHex(account, 4)}`}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={copy(account)}>
                                    <FileCopyIcon fontSize="small"/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid className={classes.menuItem} container direction="column" spacing={2}>
                        <Typography variant="body1" color="textPrimary">
                            Wallet
                        </Typography>
                        <Grid className={classes.menuItemDetails} container item direction="row" justify="center" spacing={2}>
                            <Grid item>
                                <Typography variant="body2" color="secondary">
                                    {`${shortenHex(onChainWalletAddress, 4)}`}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={copy(onChainWalletAddress)}>
                                    <FileCopyIcon fontSize="small"/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Menu>
        </>
    )
    return (
        <>
        </>
    )
}