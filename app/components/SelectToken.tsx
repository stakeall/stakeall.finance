import React, {useContext, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import {createMetamaskTokenUrl, formatBalance} from "../util";
import Typography from "@material-ui/core/Typography";
import {ContractMap} from "../constants/contractMap";
import {TokenSelectionModal} from "./TokenSelectionModal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {graphToken, GRT_DECIMAL} from "../constants/contracts";
import {Bitstake} from "../contexts/Bitstake";
import {TokenNameSymbol} from "./TokenNameSymbol";

interface SelectTokenProps {
    tokenDetails?: ContractMap[string],
    handleTokenChange: (token: string) => void,
}

const useSelectTokenStyles = makeStyles((theme) =>
    createStyles({
        buttonContainer: {
            minWidth: '300px',
            padding: '8px',
        },
    })
)


export const SelectToken: React.FC<SelectTokenProps> = ({tokenDetails, handleTokenChange}) => {
    const classes = useSelectTokenStyles();
    const {getTokenBalance} = useContext(Bitstake);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [data, setData] = useState<string>('');
    useEffect(() => {
        setData('');
        const fetchAmount = async () => {
            if(tokenDetails?.id) {
                const amount = await getTokenBalance?.(tokenDetails?.id);

                setData(formatBalance(amount || '', tokenDetails?.decimals));
            }
        }

        fetchAmount();

    }, [tokenDetails])
    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => {setModalOpen(true)}}>
                <Grid
                    className={classes.buttonContainer}
                    direction="row"
                    container
                    justify="space-between"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <TokenNameSymbol tokenId={tokenDetails?.id || ''} />
                    <Grid item alignItems="center">
                        <Typography variant="body1" color="textPrimary">
                            {data}
                        </Typography>
                    </Grid>
                </Grid>
            </Button>
            <TokenSelectionModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                handleTokenChange={handleTokenChange}
            />
        </>
    )
}
