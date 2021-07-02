import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";

const useLoadingStyles = makeStyles((theme) =>
    createStyles({
       container: {
           padding: '50px',
       },
    })
)
export const Loading: React.FC = () => {
    const classes = useLoadingStyles();
   return (
       <Grid className={classes.container} container direction="column" justify="center" alignItems="center">
          <Grid item>
             <CircularProgress size={100} color="primary"/>
          </Grid>
          <Grid item>
             <Typography variant="h5" color="secondary">
                Please wait while we get your data...
             </Typography>
          </Grid>
       </Grid>
   )
}