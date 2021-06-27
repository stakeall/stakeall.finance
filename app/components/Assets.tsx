import React, {useCallback, useEffect, useMemo, useState} from "react";
import BN from "bn.js";
import {Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";

import {covalent} from "../api/api";
import {BalanceResponse} from "../types/Covalent";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import {useWeb3ReactWrapper} from "../hooks/useWeb3ReactWrapper";
import { BalanceDetailsMap } from "../util";
import { parse } from "graphql";

const useAssetStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {},
        tableContainer: {
            height: '100%',
        },
        logo: {
            height: '30px',
            width: '30px',
            objectFit: 'contain',
        }
    })
)

const headers = [
    {
        id: 'logo',
        label: '',
        width: 50,
    },
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'price',
        label: 'Price',
    },
    {
        id: 'quantity',
        label: 'Quantity',
    },
    {
        id: 'usdValue',
        label: 'USD value',
    },
] as const;


const formatBalance = (balance: string, decimal: number):string => {
    const base = new BN(10).pow(new BN(decimal));
    // @ts-ignore
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div + "." + dm.mod.toString(10, decimal)).toFixed(3);
}

const formatUSDWorthOfAsset =  (formattedBalance: string, usdPrice: string):string => {
    const usdPriceFloat = parseFloat(usdPrice);
    const formattedBalanceFloat = parseFloat(formattedBalance);
    return `$${parseFloat(`${formattedBalanceFloat * usdPriceFloat}`).toFixed(2)}`;
}

export const Assets = () => {
    const classes = useAssetStyles();
   const {account, chainId} = useWeb3ReactWrapper();
    const [balances, setBalances] = useState<StandardTableRows<typeof headers>>([]);

    const mapToAssets = useCallback((balances: BalanceDetailsMap) => {
        return Object.keys(balances).map((address,) => {
            const item = balances[address];
            const formattedBalance = formatBalance(item.balance || '0', item.decimals);
            return {
                logo: <img className={classes.logo} src={item.imgSrc} alt={item.name}/>,
                name: item.symbol,
                quantity: formatBalance(item.balance || '0', item.decimals),
                price: item.usdPrice || '-',
                usdValue: item.usdPrice && formattedBalance && formatUSDWorthOfAsset(formattedBalance, item.usdPrice)
            }
        });
    }, [classes]);

    useEffect(() => {
        const fetchBalances = async (acc: string, ch: number) => {
            const balances = await covalent.getAllBalance(ch, acc)
            setBalances(mapToAssets(balances));
        }
        if (account && chainId) {
            fetchBalances(account, chainId);
        }

    }, [account, chainId, window.web3])


    return (
        <Grid className={classes.tableContainer} container>
            <StandardTable headers={headers} rows={balances}/>
        </Grid>
    );
}