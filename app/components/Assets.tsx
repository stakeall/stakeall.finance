import React, {useCallback, useEffect, useMemo, useState, useContext} from "react";
import {Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";

import {covalent} from "../api/api";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import {useWeb3React} from "@web3-react/core";
import {BalanceDetailsMap, formatBalance} from "../util";
import {Bitstake} from "../contexts/Bitstake";

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

const formatUSDWorthOfAsset =  (formattedBalance: string, usdPrice: string):string => {
    const usdPriceFloat = parseFloat(usdPrice);
    const formattedBalanceFloat = parseFloat(formattedBalance);
    return `$${parseFloat(`${formattedBalanceFloat * usdPriceFloat}`).toFixed(2)}`;
}

export const Assets = () => {
    const {getUserActions} = useContext(Bitstake);
    const classes = useAssetStyles();
   const {account, chainId} = useWeb3React();
    const [balances, setBalances] = useState<StandardTableRows<typeof headers>>([]);

    const mapToAssets = useCallback((balances: BalanceDetailsMap) => {
        return Object.keys(balances).map((address,) => {
            const item = balances[address];
            const formattedBalance = formatBalance(item.balance || '0', item.decimals);
            return {
                logo: <img className={classes.logo} src={item.imgSrc} alt={item.name}/>,
                name: item.symbol,
                quantity: formattedBalance,
                price: item.usdPrice || '-',
                usdValue: item.usdPrice && formattedBalance && formatUSDWorthOfAsset(formattedBalance, item.usdPrice)
            }
        });
    }, [classes]);

    useEffect(() => {
        const fetchBalances = async (acc: string, ch: number) => {
            const balance = await covalent.getAllBalance(ch, acc)
            setBalances(mapToAssets(balance));
        }

        const fetchUserTransactions = async(acc: string) => {
            await getUserActions(acc);
        }
        if (account && chainId) {
            fetchBalances(account, chainId);
            fetchUserTransactions(account);
        }

    }, [account, chainId])


    return (
        <Grid className={classes.tableContainer} container>
            <StandardTable headers={headers} rows={balances}/>
        </Grid>
    );
}