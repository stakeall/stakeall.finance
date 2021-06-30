import {gql, useQuery} from "@apollo/client";
import {AaveReserveResponse, ReserveData} from "../types/AaveData";
import {AaveClient} from "../api/graphQl/apolloClient";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import {AppCommon} from "../contexts/AppCommon";
import {v2} from "@aave/protocol-js";
import {Grid} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {shortenHex} from "../util";
import {graphToken} from "../constants/contracts";
import Button from "@material-ui/core/Button";

interface BorrowTableProps {
    setBorrowerId: (borrowerId: string) => void,
}

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
  incentivesControllers {
    emissionEndTimestamp
}
}
`;

const useBorrowTableStyles = makeStyles((theme) =>
    createStyles({
        tableContainer: {
            height: '100%',
        },
        container: {
            padding: '50px',
        },
        buttonContainer: {
        },
        validator: {
            padding: theme.spacing(5),
        },
    })
)

const headers = [
    {
        id: 'assetAddress',
        label: 'Asset Address',
        width: 50,
    },
    {
        id: 'symbol',
        label: 'Asset',
        width: 50,
    },
    {
        id: 'variableBorrowRate',
        label: 'Variable Interest Rate',
        width: 50,
    },
    {
        id: 'stableBorrowRate',
        label: 'Stable Borrow Rate',
        width: 50,
    },
    {
        id: 'borrowAmount',
        label: 'Borrow Amount',
        width: 50,
    },
    {
        id: 'swapAmount',
        label: 'Swap Amount',
        width: 50,
    },
    {
        id: 'borrowSymbol',
        label: 'Borrow Asset',
        width: 50,
    },
    {
        id: 'borrowAssetAddress',
        label: 'Borrow Asset Address',
        width: 50,
    },
    {
        id: 'actions',
        label: 'Actions',
        width: 50,
    },
] as const;

const mapToTableData = (reserveFormattedData: v2.ComputedReserveData[], onBorrow: (borrowerId: string) => void): StandardTableRows<typeof headers> => {
    return reserveFormattedData.map((row) => {
        return {
            "assetAddress": shortenHex(row.underlyingAsset),
            "assetName": row.name,
            "symbol" : row.symbol,
            "variableBorrowRate": (parseFloat(row.variableBorrowRate) * 100),
            "stableBorrowRate": (parseFloat(row.stableBorrowRate) * 100),
            "borrowAmount": 4,
            "swapAmount": "100",
            "borrowSymbol": "GRT",
            "borrowAssetAddress": shortenHex(graphToken),
            actions: (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => { onBorrow(row.underlyingAsset)}}
                >
                    Borrow
                </Button>
            ),
        }

    });

}

const getAavePrice = (reserveData: ReserveData[]) => {

    const aaveReserve = reserveData.find(reserve => reserve.symbol === "AAVE");
    console.log('aaveReserve ', aaveReserve);
    return aaveReserve && aaveReserve.price.priceInEth;

}

export const BorrowTable: React.FC<BorrowTableProps> = ({setBorrowerId}) => {

    const classes = useBorrowTableStyles();
    const {data, loading, error} = useQuery<AaveReserveResponse['data']>(query, {
        client: AaveClient,
    });
    const [tableData, setTableData] = useState<StandardTableRows<typeof headers>>([]);


    const onBorrow = useCallback((borrowerId: string) => {
        setBorrowerId?.(borrowerId);
    }, [setBorrowerId]);

    const currentTimestamp = (Date.now() / 1000).toFixed();

    useEffect(() => {
        if (data) {
            const aavePriceInEth = getAavePrice(data?.reserves);
            const emissionEndTimestamp = data.incentivesControllers[0].emissionEndTimestamp;
            const reserveFormattedData = v2.formatReserves(data.reserves, parseInt(currentTimestamp), [], aavePriceInEth, emissionEndTimestamp);
            setTableData(mapToTableData(reserveFormattedData, onBorrow));
        }
    }, [data]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        console.error(error);
        return null;
    }

    return (
        <Grid className={classes.tableContainer} container>
            <StandardTable headers={headers} rows={tableData}/>
        </Grid>
    );
};