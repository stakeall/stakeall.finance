import React from "react";
import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import {StakingProtocol} from "../hooks/useBitstake";
import {BASE_IMAGE_URL, graphToken, maticToken} from "../constants/contracts";
import {contractMap} from "../constants/contractMap";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";

interface StakeCardsProps {
    onSelect: (item: number) => void,
}

const useStakeCardsStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: theme.spacing(2),
        },
        card: {
            height: '300px',
            width: '300px',
            padding: theme.spacing(4),
            textAlign: 'center',
        },
        image: {
            height: '120px',
            width: '120px',
            objectFit: 'contain',
        },
        ribbon: {
            backgroundColor: theme.palette.secondary.main,
            width: '100%',
            color: theme.palette.secondary.contrastText,
        }
    })
)

export const StakeCards: React.FC<StakeCardsProps> = ({onSelect}) => {
    const classes = useStakeCardsStyles();
    return (
        <Grid className={classes.container} container justify="center" spacing={10}>
            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => {onSelect(0)}}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <Typography variant="body1" color="secondary">
                                    Wallet
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    Stake directly from your wallet
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => { onSelect(1)}}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <Typography variant="body1" color="secondary">
                                    Swap and Stake
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    Swap your token and stake
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => { onSelect(2)}}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <Typography variant="body1" color="secondary">
                                    Borrow, Swap and Stake
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    Borrow token, then swap before you stake
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    )
}