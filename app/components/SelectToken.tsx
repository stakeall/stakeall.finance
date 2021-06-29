import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import {createMetamaskTokenUrl} from "../util";
import Typography from "@material-ui/core/Typography";
import {ContractMap} from "../constants/contractMap";
import {TokenSelectionModal} from "./TokenSelectionModal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";

interface SelectTokenProps {
    tokenDetails?: ContractMap[string],
    handleTokenChange: (token: string) => void,
}

const useSelectTokenStyles = makeStyles((theme) =>
    createStyles({
        buttonContainer: {
        },
    })
)


export const SelectToken: React.FC<SelectTokenProps> = ({tokenDetails, handleTokenChange}) => {
    const classes = useSelectTokenStyles();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => {setModalOpen(true)}}>
                <Grid
                    className={classes.buttonContainer}
                    direction="row"
                    container
                    spacing={2}
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item alignItems="center" justify="flex-start">
                        <img
                            height="40px"
                            width="40px"
                            src={tokenDetails?.imgSrc || createMetamaskTokenUrl(tokenDetails?.logo || "")}
                            alt={tokenDetails?.name}
                        />
                    </Grid>
                    <Grid item alignItems="center">
                        <Typography variant="body1" color="textPrimary">
                            {tokenDetails?.symbol}
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
