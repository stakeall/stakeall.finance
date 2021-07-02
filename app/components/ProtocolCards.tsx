import React, {useContext} from "react";
import {createStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import {BASE_IMAGE_URL, graphToken, maticToken} from "../constants/contracts";
import {contractMap} from "../constants/contractMap";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AppCommon} from "../contexts/AppCommon";
import {StakingProtocol} from "../hooks/useBitstake";

interface  ProtocolCardsProps {}

const useProtocolCardsStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: theme.spacing(2),
        },
        card: {
            height: '250px',
            width: '250px',
            padding: theme.spacing(2),
        },
        image: {
            height: '120px',
            width: '120px',
            objectFit: 'contain',
        },
    })
)

export const ProtocolCards: React.FC<ProtocolCardsProps> = () => {
    const classes = useProtocolCardsStyles();
    const {setProtocol} = useContext(AppCommon);
    return (
        <Grid className={classes.container} container justify="center" spacing={10}>
            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => {
                        console.log({setProtocol});
                        setProtocol?.(StakingProtocol.GRAPH);
                    }}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <img className={classes.image} src={`${BASE_IMAGE_URL}${contractMap[graphToken].logo}`} alt="graph" />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="secondary" id="modal-modal-description">
                                    Graph
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary" id="modal-modal-description">
                                    Graph Description
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => {
                        setProtocol?.(StakingProtocol.MATIC);
                    }}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <img className={classes.image} src={`${BASE_IMAGE_URL}${contractMap[maticToken].logo}`} alt="graph" />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="secondary" id="modal-modal-description">
                                    Matic
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary" id="modal-modal-description">
                                    Matic Description
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    )
}
