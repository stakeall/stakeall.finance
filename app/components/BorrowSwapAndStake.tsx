import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Button from "@material-ui/core/Button";
import {ETH_TOKEN, graphToken} from "../constants/contracts";
import {createMetamaskTokenUrl, shortenHex} from "../util";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {TokenSelectionModal} from "./TokenSelectionModal";
import {ContractMap, contractMap} from "../constants/contractMap";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import {Bitstake} from "../contexts/Bitstake";
import {AppCommon} from "../contexts/AppCommon";
import {BN} from "ethereumjs-util";
import {gql, useQuery} from "@apollo/client";
import {IndexersResponse} from "../types/Indexers";
import {AaveClient} from "../api/graphQl/apolloClient";

const query = gql`
{
  reserves (where: {
    usageAsCollateralEnabled: true
  }) {
    id
    name
    price {
      id
    }
    liquidityRate
    variableBorrowRate
    stableBorrowRate
  }
}
`;

const useBorrowSwapAndStakeStyles = makeStyles((theme) =>
    createStyles({
        container: {
            padding: '50px',
            margin: '50px',
        },
        buttonContainer: {
        },
        validator: {
            padding: theme.spacing(5),
        },
    })
)

export const BorrowSwapAndStake = () => {
    const classes = useBorrowSwapAndStakeStyles();

    const {data, loading, error} = useQuery<IndexersResponse['data']>(query, {
        client: AaveClient,
    });


    return (
        <>
            <Paper className={classes.container}>
                <Grid container spacing={4} direction="column">
                    <pre>
                        {JSON.stringify(error || data, null, 4)}
                    </pre>
                </Grid>
            </Paper>
        </>
    )
};