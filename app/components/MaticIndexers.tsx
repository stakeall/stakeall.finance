import React, {useCallback, useContext, useEffect, useState} from "react";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import {AppCommon} from "../contexts/AppCommon";
import {useRouter} from "next/router";
import {Loading} from "./Loading";
import {MaticResponse, MaticResult} from "../types/Matic";
import {matic} from "../api/api";
import {IndexerNameLogo} from "./IndexerNameLogo";


const headers = [
    {
        id: 'name',
        label: 'Name',
        width: 50,
    },
    {
        id: 'id',
        label: 'Indexer Id',
        width: 50,
    },
    {
        id: 'stake',
        label: 'Stake',
        width: 50,
    },
    {
        id: 'commission',
        label: 'Commission',
        width: 50,
    },
    {
        id: 'actions',
        label: 'Actions',
        width: 50,
    },
] as const;

const mapToTableData = (data: MaticResponse, onDelegate: (indexerId: string) => void): StandardTableRows<typeof headers> => {
    return data.result?.map((item: MaticResult) => ({
        id: item.id,
        name: <IndexerNameLogo logoUrl={item.logoUrl || ''} name={item.name || ''}/>,
        stake: item.totalStaked,
        commission: item.commissionPercent,
        actions:(
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => { onDelegate(item.id?.toString() || '') }}
            >
                Delegate
            </Button>
        ),
    })) || [];
};

const useIndexersStyles = makeStyles(() =>
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

export const MaticIndexers = () => {
    const classes = useIndexersStyles(); const [tableData, setTableData] = useState<StandardTableRows<typeof headers>>([]); const [loading, setLoading] = useState<boolean>(false); const { setValidator } = useContext(AppCommon);
    const router = useRouter();


    const onDelegate = useCallback((indexerId: string) => {
        setValidator?.(indexerId);
        router.push('/staking');
    }, []);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const res = await matic.getIndexers();
            setTableData(mapToTableData(res.data, onDelegate));
            setLoading(false);
        }
        getData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <Grid className={classes.tableContainer} container>
            <StandardTable headers={headers} rows={tableData}/>
        </Grid>
    );
}