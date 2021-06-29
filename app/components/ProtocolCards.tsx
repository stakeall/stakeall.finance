import React from "react";
import {ClassNameMap, createStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import {BASE_IMAGE_URL, graphToken} from "../constants/contracts";
import {contractMap} from "../constants/contractMap";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {GRAPH} from "../constants/Protocols";

interface  ProtocolCardsProps {
    setSelectedProtocol: (name: string) => void;
}

const useProtocolCardsStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: theme.spacing(2),
        },
        card: {
            padding: theme.spacing(2),
        }
    })
)

export const ProtocolCards: React.FC<ProtocolCardsProps> = ({setSelectedProtocol}) => {
    const classes = useProtocolCardsStyles();
    return (
        <Grid className={classes.container} container justify="center">
            <Card variant="outlined">
                <CardActionArea className={classes.card} onClick={() => { setSelectedProtocol(GRAPH)}}>
                    <Grid container direction="column" alignItems="center">
                        <Grid item>
                            <img src={`${BASE_IMAGE_URL}${contractMap[graphToken].logo}`} alt="graph" />
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" color="secondary" id="modal-modal-description">
                                Graph
                            </Typography>
                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>
    )
}
