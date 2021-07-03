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
import {getTokenByProtocol} from '../util';

interface  ProtocolCardsProps {}

const useProtocolCardsStyles = makeStyles((theme) =>
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

export const ProtocolCards: React.FC<ProtocolCardsProps> = () => {
    const classes = useProtocolCardsStyles();
    const {setProtocol} = useContext(AppCommon);
    const livePeerAddress = getTokenByProtocol(StakingProtocol.LIVEPEER).address;
    const nucypherAddress = getTokenByProtocol(StakingProtocol.NUCYPHER).address;

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
                                The Graph is an indexing protocol for querying networks like Ethereum and IPFS.
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
                                <img className={classes.image} src={`${BASE_IMAGE_URL}${contractMap[maticToken].logo}`} alt="matic" />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="secondary" id="modal-modal-description">
                                    Matic
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary" id="modal-modal-description">
                                Polygon is a protocol and a framework for building and connecting Ethereum-compatible blockchain networks.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item>
                <Card variant="outlined">
                    <CardActionArea className={classes.card} onClick={() => {
                        setProtocol?.(StakingProtocol.NUCYPHER);
                    }}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <img className={classes.image} src="https://cryptologos.cc/logos/nucypher-nu-logo.png" alt="graph" />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="secondary" id="modal-modal-description">
                                    Nucypher
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary" id="modal-modal-description">
                                Cryptographic Infrastructure for Privacy-Preserving Applications.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                    <Grid className={classes.ribbon} item>
                        <Typography align="center" variant="body2" id="modal-modal-description">
                            Coming soon
                        </Typography>
                    </Grid>
                </Card>
            </Grid>

            <Grid item>
                <Card variant="outlined">
                    <CardActionArea disabled className={classes.card} onClick={() => {
                        setProtocol?.(StakingProtocol.LIVEPEER);
                    }}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item>
                                <img className={classes.image}   src={`${BASE_IMAGE_URL}${contractMap[livePeerAddress].logo}`} alt="graph"  />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="secondary" id="modal-modal-description">
                                    LivePeer
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary" id="modal-modal-description">
                                    Livepeer is a decentralized video streaming network built on the Ethereum blockchain.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                    <Grid className={classes.ribbon} item>
                        <Typography align="center" variant="body2" id="modal-modal-description">
                            Coming soon
                        </Typography>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}
