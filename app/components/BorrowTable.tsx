import {gql, useQuery} from "@apollo/client";
import {AaveReserveResponse, ReserveData} from "../types/AaveData";
import {AaveClient} from "../api/graphQl/apolloClient";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import {AppCommon} from "../contexts/AppCommon";
import {ComputedReserveData, v2} from "@aave/protocol-js";
import {Grid} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {shortenHex, toWei} from "../util";
import {graphToken} from "../constants/contracts";
import Button from "@material-ui/core/Button";
import {ContractMap} from "../constants/contractMap";
import {Bitstake} from "../contexts/Bitstake";
import {oneInchApi} from "../api/api";
import BN from "bn.js";

interface BorrowTableProps {
    setBorrowerId: (borrowerId: string) => void,
    borrowDetails: {
        validator?: string,
        depositTokenDetails?: ContractMap[string],
        depositAmount?: string,
        borrowTokenDetails?: ContractMap[string],
        borrowerId?: string,
    },
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
        id: 'maxBorrowAmount',
        label: 'Max Borrow Amount',
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

const aaveAdddressesMap = {
    "0xdac17f958d2ee523a2206206994597c13d831ec7": 1,
    // "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 1, WBTC
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 1,
    // "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e": 1, YFI
    "0xe41d2489571d322189246dafa5ebde1f4699f498": 1,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": 1,
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": 1,
    "0x0d8775f648430679a709e98d2b0cb6250d2887ef": 1,
    "0x4fabb145d64652a948d72533023f6e7a623c7c53": 1,
    "0x6b175474e89094c44da98b954eedeac495271d0f": 1,
    "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c": 1,
    "0xdd974d5c2e2928dea5f71b9825b8b646686bd200": 1,
    "0x514910771af9ca656af840dff83e8264ecf986ca": 1,
    "0x0f5d2fb29fb7d3cfee444a200298f468908cc942": 1,
    "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": 1,
    "0x408e41876cccdc0f92210600ef50372656052a38": 1,
    "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f": 1,
    "0x57ab1ec28d129707052df4df418d58a2d46d5f51": 1,
    "0x0000000000085d4780b73119b644ae5ecd22b376": 1,
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 1,
    "0xd533a949740bb3306d119cc777fa900ba034cd52": 1,
    "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd": 1,
    "0xba100000625a3754423978a60c9317c58a424e3d": 1,
    "0x8798249c2e607446efb7ad49ec89dd1865ff4272": 1,
    "0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5": 1
};

const getReserve = (reserveData: ReserveData[], symbol?: string) => { // todo:  symbol should not be optional 
    console.log('symbol : ',symbol);
    console.log('reserveData : ', reserveData);
    const tokenReserve = reserveData.find(reserve => reserve.symbol === symbol || (symbol === "ETH" && reserve.symbol === "WETH"));
    console.log('tokenReserve ', tokenReserve);
    return tokenReserve;
}

// const mapToTableData = (
//     reserveFormattedData: v2.ComputedReserveData[],
//     borrowDetails: BorrowTableProps['borrowDetails'],
//     onBorrow: (borrowerId: string) => void
// ): StandardTableRows<typeof headers> => {
//     const maxBorrowAmount = 1;
//     return reserveFormattedData.map((row) => {
//         return {
//             "assetAddress": shortenHex(row.underlyingAsset),
//             "assetName": row.name,
//             "symbol" : row.symbol,
//             "variableBorrowRate": (parseFloat(row.variableBorrowRate) * 100),
//             "stableBorrowRate": (parseFloat(row.stableBorrowRate) * 100),
//             "maxBorrowAmount": 4,
//             "swapAmount": "100",
//             "borrowSymbol": "GRT",
//             "borrowAssetAddress": shortenHex(graphToken),
//             actions: (
//                 <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => { onBorrow(row.underlyingAsset)}}
//                 >
//                     Borrow
//                 </Button>
//             ),
//         }
//
//     });
// }


const mapTableItem = async (row: ComputedReserveData) => {
    return {

    }
}
const mapToTableData = async (
    data: AaveReserveResponse['data'],
    borrowDetails: BorrowTableProps['borrowDetails'],
    onBorrow: (borrowerId: string) => void,
    onChainWalletAddress?: string,
): Promise<StandardTableRows<typeof headers>> => {
    const currentTimestamp = (Date.now() / 1000).toFixed();
    console.log('data ',data);
    const aaveReserve = getReserve(data?.reserves, "AAVE");

    const aavePriceInEth = aaveReserve?.price.priceInEth;
    const emissionEndTimestamp = data.incentivesControllers[0].emissionEndTimestamp;
    const reserveFormattedData = v2.formatReserves(data.reserves, parseInt(currentTimestamp), [], aavePriceInEth, emissionEndTimestamp);
    const sourceTokenReserve = getReserve(reserveFormattedData, borrowDetails?.depositTokenDetails?.symbol);
    const sourceTokenPriceInEth = sourceTokenReserve?.price.priceInEth || '0';
    const sourceTokenBaseLTVasCollateral = sourceTokenReserve?.baseLTVasCollateral || '0';

    return Promise.all(reserveFormattedData.map(async (row) => {
        console.log('sourceTokenBaseLTVasCollateral : ', sourceTokenBaseLTVasCollateral);
        console.log('sourceTokenReserve symbol ', sourceTokenReserve);
        console.log('row ', row);
        // const maxBorrowAmount =
        //     new BN(parseFloat(sourceTokenBaseLTVasCollateral) / 10000)
        //         .mul(
        //             new BN(toWei(borrowDetails?.depositAmount || '0', 18)) // todo..send token
        //                 .mul(new BN(sourceTokenPriceInEth))
        //                 .div(new BN(row.price.priceInEth))
        //             );
        console.log('borrowDetails?.depositAmount :', borrowDetails?.depositAmount);
        const maxBorrowAmount = (
            parseFloat(sourceTokenBaseLTVasCollateral) / 10000) *
            (
                (parseFloat(borrowDetails?.depositAmount || '0') * parseFloat(sourceTokenPriceInEth))
                / parseFloat(row.price.priceInEth)
            );

        console.log('borrowDetails?.depositAmount ', borrowDetails?.depositAmount);
        console.log('max borrw amt : ',maxBorrowAmount);
        const swapResponse = await oneInchApi.getEstimatedSwapDetails(row.underlyingAsset, graphToken, toWei(maxBorrowAmount.toString(), row.decimals), "1", onChainWalletAddress);
        const swapAmount = swapResponse.data.toTokenAmount;
        return {
            "assetAddress": shortenHex(row.underlyingAsset),
            "assetName": row.name,
            "symbol" : row.symbol,
            "variableBorrowRate": (parseFloat(row.variableBorrowRate) * 100),
            "stableBorrowRate": (parseFloat(row.stableBorrowRate) * 100),
            "maxBorrowAmount": maxBorrowAmount,
            "swapAmount": swapAmount,
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
    }));
}

const filterOutReserves = (aaveReserves) => {
    const filteredReverses = [];
    console.log('aavereserves : ',aaveReserves);
    aaveReserves.reserves.forEach(element => {
        console.log('element.underlyingAsset : ', element.underlyingAsset);
        if (aaveAdddressesMap[element.underlyingAsset]) {
           filteredReverses.push(element); 
        }
    });

    return filteredReverses;

}

export const BorrowTable: React.FC<BorrowTableProps> = ({setBorrowerId, borrowDetails}) => {

    const classes = useBorrowTableStyles();
    const {data, loading, error} = useQuery<AaveReserveResponse['data']>(query, {
        client: AaveClient,
    });
    const [tableData, setTableData] = useState<StandardTableRows<typeof headers>>([]);
    const {onChainWalletAddress} = useContext(Bitstake);
    console.log('onChainWalletAddress : ', onChainWalletAddress);
    const onBorrow = useCallback((borrowerId: string) => {
        setBorrowerId?.(borrowerId);
    }, [setBorrowerId]);


    useEffect(() => {
        const mapData = async () => {
            if (data) {
                // 
                const filteredReserves = filterOutReserves(data);
                console.log('filteredReserves : ',filteredReserves);
                const mappedData = await mapToTableData({ reserves: filteredReserves, incentivesControllers: data.incentivesControllers}, borrowDetails, onBorrow, onChainWalletAddress);
                console.log('mappedData : ', mappedData);
                setTableData(mappedData);
            }
        }
            mapData();
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