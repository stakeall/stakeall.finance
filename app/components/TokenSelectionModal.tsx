import React, {useContext, useEffect, useMemo, useState} from "react";
import {Modal} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Bitstake} from "../contexts/Bitstake";
import TextField from "@material-ui/core/TextField";
import {contractMap} from "../constants/contractMap";
import {BalanceDetailsMap, createMetamaskTokenUrl, formatBalance} from "../util";
import {covalent} from "../api/api";
import {useWeb3React} from "@web3-react/core";
import {graphToken} from "../constants/contracts";
import {TokenNameSymbol} from "./TokenNameSymbol";

interface TokenSelectionModalProps {
    open: boolean;
    handleClose: VoidFunction;
    handleTokenChange: (name: string) => void,
}


const useTokenSelectionModalStyles = makeStyles((theme) =>
    createStyles({
        modalContainer: {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: '24px',
            padding: 40,
        },
        buttonContainer: {
            width: 'auto',
        },
        listButtonContainer: {
            height: '80px',
        },
        tokenSearch: {
            width: 'auto',
            margin: theme.spacing(4),
        },
        tokenListContainer: {
            margin: theme.spacing(4),
            height: '400px',
            width: '400px',
            overflowY: 'scroll',
            overflowX: 'hidden',
        },
        item: {
            width: 'auto',
            marginRight: theme.spacing(2),
        }

    })
)
export const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({open, handleClose, handleTokenChange}) => {
    const classes = useTokenSelectionModalStyles();
    const {account, chainId} = useWeb3React();
    const [search, setSearch] = useState<string>('');
    const [balances, setBalances] = useState<BalanceDetailsMap>();

    const filteredTokens = useMemo(() => {
        if(!balances) {
            return [];
        }
        const availableContractMap = Object.values(contractMap)
            .filter(item => Object.keys(balances).includes(item.id))
            .filter(item => item.id !== graphToken);
        return Object.values(availableContractMap).filter(item => {
            return item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.symbol?.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, balances]);

    useEffect(() => {
        const fetchBalances = async (acc: string, ch: number) => {
            const balance = await covalent.getAllBalance(ch, acc);
            setBalances(balance);
        }
        if (account && chainId) {
            fetchBalances(account, chainId);
        }

    }, [account, chainId, open])
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-token-selection"
        >
            <Box className={classes.modalContainer}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Select a token
                </Typography>
                <Grid className={classes.tokenSearch} container justify="flex-start" spacing={2}>
                    <TextField
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        placeholder="Search Name"
                    />
                </Grid>
                <Grid className={classes.tokenListContainer} item>
                    <Grid container justify="flex-start" spacing={2} direction="column">
                        {filteredTokens.map((token) => (
                            <Button color="secondary" onClick={() => {
                                handleTokenChange(token.name);
                                handleClose();
                            }}>
                                <Grid
                                    className={classes.listButtonContainer}
                                    direction="row"
                                    container
                                    item
                                    spacing={2}
                                    justify="space-around"
                                    alignItems="center"
                                >
                                    <Grid className={classes.item} container item direction="row">
                                        <TokenNameSymbol tokenId={token?.id} />
                                    </Grid>
                                    <Grid className={classes.item} item container alignItems="center">
                                        <Typography variant="body1" color="textPrimary">
                                            {formatBalance(balances?.[token?.id].balance || '0', token?.decimals)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Button>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
