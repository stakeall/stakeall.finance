import {useContext} from "react";
import {Modal} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Bitstake} from "../contexts/Bitstake";

interface AccountConnectModalProps {
    open: boolean;
    handleClose: VoidFunction;
}


const useAccountConnectModalStyles = makeStyles((theme) =>
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
            padding: 20,
        }
    })
)
export const AccountConnectModal: React.FC<AccountConnectModalProps> = ({open, handleClose}) => {
    const classes = useAccountConnectModalStyles();
    const { deployOnChainWallet } = useContext(Bitstake);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalContainer}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Create Account to manage your funds
                </Typography>
                <Grid className={classes.buttonContainer} container justify="flex-end" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={() => {
                            deployOnChainWallet();
                            handleClose();
                        }}> Create </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={handleClose}> Cancel </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}