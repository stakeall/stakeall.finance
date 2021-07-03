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
import {Loading} from "./Loading";
import {UserActionResponse} from "../hooks/useBitstake";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {TokenNameSymbol} from "./TokenNameSymbol";

const useAssetStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {},
        tableContainer: {
            height: '100%',
            padding: '30px',
        },
        logo: {
            height: '30px',
            width: '30px',
            objectFit: 'contain',
        }
    })
)

const balanceHeaders = [
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

const userTransactionHeaders = [
    {
        id: 'indexer',
        label: 'Indexer',
    },
    {
        id: 'amount',
        label: 'Amount',
    },
    {
        id: 'timestamp',
        label: 'Timestamp',
    },
    {
        id: 'actions',
        label: 'Actions',
    },
] as const;

const maticTransactionHeaders = [
    {
        id: 'validator',
        label: 'Validator',
    },
    {
        id: 'amount',
        label: 'Amount',
    },
    {
        id: 'timestamp',
        label: 'Timestamp',
    },
    {
        id: 'actions',
        label: 'Actions',
    },
] as const;


const aaveLoansHeader = [
    {
        id: 'borrowToken',
        label: 'Borrow Token',
    },
    {
        id: 'borrowAmount',
        label: 'Amount',
    },
    {
        id: 'rateMode',
        label: 'Rate Mode',
    },
    {
        id: 'timestamp',
        label: 'Timestamp',
    },
] as const;


const mapUserActionsTable = (data: UserActionResponse): StandardTableRows<typeof userTransactionHeaders> => {
    return data.graphProtocolDelegation.map(item => ({
        indexer: item.indexer,
        amount: item.amount,
        timestamp: item.blockTimestamp,
        actions: <Button
            variant="outlined"
            color="secondary"
            disabled
        >
            Manage
        </Button>
    }));
}

const mapMaticDelegationTable = (data: UserActionResponse): StandardTableRows<typeof maticTransactionHeaders> => {
    return data.maticProtocolDelegation.map(item => ({
        validator: item.validator,
        amount: item.amount,
        timestamp: item.blockTimestamp,
        actions: <Button
            variant="outlined"
            color="secondary"
            disabled
        >
            Manage
        </Button>
    }));
}

const mapAAVEBorrowTable = (data: UserActionResponse): StandardTableRows< typeof aaveLoansHeader> => {
    return data.aaveBorrows.map(item => ({
        borrowToken: item.borrowToken,
        borrowAmount: item.borrowAmt,
        rateMode: item.rateMode,
        timestamp: item.blockTimestamp,
        actions: <Button
            variant="outlined"
            color="secondary"
            disabled
        >
            Manage
        </Button>
    }));
}

const formatUSDWorthOfAsset = (formattedBalance: string, usdPrice: string): string => {
    const usdPriceFloat = parseFloat(usdPrice);
    const formattedBalanceFloat = parseFloat(formattedBalance);
    return `$${parseFloat(`${formattedBalanceFloat * usdPriceFloat}`).toFixed(2)}`;
}

export const Assets = () => {
    const {getUserActions} = useContext(Bitstake);
    const classes = useAssetStyles();
    const {account, chainId} = useWeb3React();
    const [balances, setBalances] = useState<StandardTableRows<typeof balanceHeaders>>([]);
    const [userTransaction, setUserTransaction] = useState<StandardTableRows<typeof userTransactionHeaders>>([]);
    const [maticTransaction, setMaticTransaction]= useState<StandardTableRows<typeof maticTransactionHeaders>>([]);
    const [aaveBorrowTransaction, setaaveBorrowTransaction] = useState<StandardTableRows<typeof aaveLoansHeader>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const mapToAssets = useCallback((balances: BalanceDetailsMap) => {
        return Object.keys(balances).map((address,) => {
            const item = balances[address];
            const formattedBalance = formatBalance(item.balance || '0', item.decimals);
            return {
                name: <TokenNameSymbol tokenId={address} />,
                quantity: formattedBalance,
                price: item.usdPrice || '-',
                usdValue: item.usdPrice && formattedBalance && formatUSDWorthOfAsset(formattedBalance, item.usdPrice)
            }
        });
    }, [classes]);

    useEffect(() => {
        const fetchBalances = async (acc: string, ch: number) => {
            setLoading(true);
            const balance = await covalent.getAllBalance(ch, acc)
            setBalances(mapToAssets(balance));
            setLoading(false);
        }

        const fetchUserTransactions = async (acc: string) => {
            const userTransactions = await getUserActions?.(acc);
            if (userTransactions) {
                setUserTransaction(mapUserActionsTable(userTransactions));
                setMaticTransaction(mapMaticDelegationTable(userTransactions));
                setaaveBorrowTransaction(mapAAVEBorrowTable(userTransactions));
            }
        }
        if (account && chainId) {
            fetchBalances(account, chainId);
            fetchUserTransactions(account);
        }

    }, [account, chainId])

    if (loading) {
        return <Loading/>;
    }

    return (
        <Grid direction="column" wrap="nowrap" container>
            <Grid className={classes.tableContainer} direction="column" wrap="nowrap" item container spacing={2}>
                <Grid item>
                    <Typography color="secondary" id="balance" variant="h5">
                        Balances
                    </Typography>
                </Grid>
                <Grid item>
                    <StandardTable headers={balanceHeaders} rows={balances}/>
                </Grid>
            </Grid>
            <Grid className={classes.tableContainer} direction="column" wrap="nowrap" item container
                  spacing={2}>
                <Grid item>
                    <Typography color="secondary" id="graphstaking" variant="h5">
                        Graph Delegations
                    </Typography>
                </Grid>
                <Grid item>
                    <StandardTable headers={userTransactionHeaders} rows={userTransaction}/>
                </Grid>
            </Grid>

            <Grid className={classes.tableContainer} direction="column" wrap="nowrap" item container
                  spacing={2}>
                <Grid item>
                    <Typography color="secondary" id="maticstaking" variant="h5">
                        Matic Delegations
                    </Typography>
                </Grid>
                <Grid item>
                    <StandardTable headers={maticTransactionHeaders} rows={maticTransaction}/>
                </Grid>
            </Grid>

            <Grid className={classes.tableContainer} direction="column" wrap="nowrap" item container
                  spacing={2}>
                <Grid item>
                    <Typography color="secondary" id="aaveLoans" variant="h5">
                        AAVE Loans
                    </Typography>
                </Grid>
                <Grid item>
                    <StandardTable headers={aaveLoansHeader} rows={aaveBorrowTransaction}/>
                </Grid>
            </Grid>
        </Grid>
    );
}