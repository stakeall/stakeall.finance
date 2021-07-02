import React, {useMemo} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {contractMap} from "../constants/contractMap";
import {createMetamaskTokenUrl} from "../util";

export interface TokenNameSymbolProps {
    tokenId: string,
}
const useTokenNameSymbolStyles = makeStyles(() =>
    createStyles({
        container: {
            width: 'auto',
        },
        logoContainer: {
            height: '46px',
            width: '46px',
        },
        logo: {
            height: '30px',
            width: '30px',
            objectFit: 'contain',
        }
    })
)
export const TokenNameSymbol: React.FC<TokenNameSymbolProps> = ({ tokenId }) => {
    const classes = useTokenNameSymbolStyles();
    const token = useMemo(() => {
        if(contractMap[tokenId]) {
            return contractMap[tokenId];
        }
        return Object.values(contractMap).find(item => item.id.toLowerCase() === tokenId.toLowerCase());
    }, [tokenId]);
    console.log({token, tokenId, contractMap});

    return (
        <Grid className={classes.container} wrap="nowrap" container spacing={2} justify="center" alignItems="center">
            <Grid className={classes.logoContainer} item>
                <img className={classes.logo} src={token?.imgSrc || createMetamaskTokenUrl(token?.logo || '')} alt={token?.name || ''}/>
            </Grid>
            <Grid item>
                <Typography variant="body1">{token?.symbol}</Typography>
            </Grid>
        </Grid>
    )
}