import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export interface IndexerNameLogoProps {
    name: string,
    logoUrl: string,
}
const useIndexerNameLogoStyles = makeStyles(() =>
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
export const IndexerNameLogo: React.FC<IndexerNameLogoProps> = ({ name, logoUrl }) => {
    const classes = useIndexerNameLogoStyles();

    return (
        <Grid className={classes.container} wrap="nowrap" container spacing={2} justify="center" alignItems="center">
            <Grid className={classes.logoContainer} item>
                <img className={classes.logo} src={logoUrl} alt={name}/>
            </Grid>
            <Grid item>
                <Typography variant="body1">{name}</Typography>
            </Grid>
        </Grid>
    )
}
