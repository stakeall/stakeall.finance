import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Theme} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";

import {covalent} from "../api/api";
import {BalanceResponse} from "../types/Covalent";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import { useWeb3ReactWrapper } from "../util";

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

export const Assets = () => {
    const classes = useAssetStyles();
   const {account, chainId} = useWeb3ReactWrapper();
    const [balances, setBalances] = useState<StandardTableRows<typeof headers>>([]);

    const mapToAssets = useCallback((balances: BalanceResponse) => {
        return balances.data.data.items.map((item, index) => ({
            logo: <img className={classes.logo} src={item.logo_url} alt={item.contract_name}/>,
            name: item.contract_name,
            quantity: (parseFloat(item.balance) / (10 ^ item.contract_decimals)).toString(),
            price: item.quote_rate,
            usdValue: item.quote,
        }));
    }, [classes]);

    useEffect(() => {
        const fetchBalances = async (acc: string, ch: number) => {
            const balances = await covalent.getAllBalance(ch, acc)
            setBalances(mapToAssets(balances));
        }
        if (account && chainId) {
            fetchBalances(account, chainId);
        }

    }, [account, chainId])


    return (
        <Grid className={classes.tableContainer} container>
            <StandardTable headers={headers} rows={balances}/>
        </Grid>
    );
}