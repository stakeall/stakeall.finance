import {useCallback, useEffect, useMemo, useState} from "react";
import {Modal} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useBitstake} from "../hooks/useBitstake";
import Grid from "@material-ui/core/Grid";

interface DelegateModalProps {
    open: boolean;
    handleClose: VoidFunction;
    indexerId: string;
}


const useModalStyles = makeStyles((theme) =>
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
export const DelegateModal: React.FC<DelegateModalProps> = ({open, handleClose, indexerId}) => {
    const classes = useModalStyles();
    const { delegate } = useBitstake();
    const [amount, setAmount] = useState<string>('');
    const [clicked, setClicked] = useState<boolean>(true);

    useEffect(() => {
        if(open) {
            setClicked(false);
            setAmount('');
        }
    }, [open])

    const amountError = useMemo(() => !amount && clicked, [amount, clicked]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalContainer}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Delegate Amount
                </Typography>
                <Typography id="modal-modal-description">
                    Indexer Id : {indexerId}
                </Typography>
                <TextField
                    value={amount}
                    error={amountError}
                    helperText={amountError && "Please enter amount"}
                    type="number"
                    onChange={(e) => {setAmount(e.target.value)}}
                    label="Amount"
                    fullWidth
                />
                <Grid className={classes.buttonContainer} container justify="flex-end" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={() => {
                            setClicked(true);
                            if(!!amount) {
                                delegate(indexerId, amount)
                                handleClose();
                            }
                        }}> Confirm </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={handleClose}> Cancel </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}