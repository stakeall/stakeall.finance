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
import { v2 } from "@aave/protocol-js"
import { AaveReserveResponse } from "../types/AaveData";

const query = gql`
{
  reserves (where: {
    usageAsCollateralEnabled: true
  }) {
    id,
    underlyingAsset,
    name,
    symbol,
    decimals,
    isActive,
    isFrozen,
    usageAsCollateralEnabled,
    # aTokenAddress,
    # stableDebtTokenAddress,
    # variableDebtTokenAddress,
    borrowingEnabled,
    stableBorrowRateEnabled,
    reserveFactor,
    baseLTVasCollateral,
    optimalUtilisationRate,
    stableRateSlope1,
    stableRateSlope2,
    averageStableRate,
    stableDebtLastUpdateTimestamp,
    baseVariableBorrowRate,
    variableRateSlope1,
    variableRateSlope2,
    liquidityIndex,
    reserveLiquidationThreshold,
    reserveLiquidationBonus,
    variableBorrowIndex,
    variableBorrowRate,
    # avg30DaysVariableBorrowRate,
    availableLiquidity,
    stableBorrowRate,
    liquidityRate,
    # avg30DaysLiquidityRate,
    totalPrincipalStableDebt,
    # totalScaledVariableDebt,
    lastUpdateTimestamp,
    price {
        priceInEth
    },
    aEmissionPerSecond,
    vEmissionPerSecond,
    sEmissionPerSecond,
    aIncentivesLastUpdateTimestamp,
    vIncentivesLastUpdateTimestamp,
    sIncentivesLastUpdateTimestamp,
    aTokenIncentivesIndex,
    vTokenIncentivesIndex,
    sTokenIncentivesIndex
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

const mappedData = (reserveFormattedData) => {

    return reserveFormattedData.map((row) => {
        return {
            "assetAddress": row.underlyingAsset,
            "assetName": row.name,
            "symbol" : row.symbol,
            "borrowInterestRate": 2,
            "borrowAmount": 4,
            "swapAmount": "100",
            "borrowSymbol": "GRT",
            "borrowAssetAddress": graphToken
        }

    });

}   

export const BorrowSwapAndStake = (sourceTokenAddress: string,) => {
    const classes = useBorrowSwapAndStakeStyles();
    const [formattedData, setFormattedData] = useState();
    const {data, loading, error} = useQuery<AaveReserveResponse['data']>(query, {
        client: AaveClient,
    });

    // aave js
    useEffect(() => {
        if(data) {
            // call 
            // a = modify
            const reserveFormattedData = v2.formatReserves(data.reserves);
            console.log('reserveFormattedData :', reserveFormattedData);
            const mappedReservedData = mappedData(reserveFormattedData);
            console.log('mappedReservedData  ', mappedReservedData);
            setFormattedData(mappedReservedData);
        }
    }, [data]);

    return (
        <>
            <Paper className={classes.container}>
                <Grid container spacing={4} direction="column">
                    <pre>
                        {JSON.stringify(error || formattedData, null, 4)}
                    </pre>
                </Grid>
            </Paper>
        </>
    )
};

/**
 * borrow asset .. underlyingAsset.. name
 * borrow intereset rate
 * borrow amount
 * swap amount
 */


