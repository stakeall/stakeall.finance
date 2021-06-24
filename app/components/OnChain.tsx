import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useState} from "react";
import {AccountConnectModal} from "./AccountConnectModal";

const useOnChainStyles = makeStyles((theme) =>
    createStyles({
        container: {
            margin: theme.spacing(1),
            position: 'relative',
        },
        progress: {
            height: '20px',
            width: '20px',
            position: 'absolute',
            top: '20%',
            left: '40%',
            zIndex: 1,
        },
    })
)

export const OnChain = () => {
    const classes = useOnChainStyles();
    const [modalOpen, setModalOpen] = useState<boolean>(false);


    return (
        <Grid className={classes.container} container>
            <Button
                color="secondary"
                onClick={() => { setModalOpen(true)}}
                variant="outlined"
            >
                Connect OnChain
            </Button>
            {modalOpen && (
                <AccountConnectModal
                    open={modalOpen}
                    handleClose={() => {setModalOpen(false)}}
                />
            )}
        </Grid>
    )
};
