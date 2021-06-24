import {useQuery, gql} from "@apollo/client";
import {IndexersEntity, IndexersResponse} from "../types/Indexers";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {StandardTable, StandardTableRows} from "../uiComponents/StandardTable";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {formatToken, truncateMiddle} from "../util";
import Button from "@material-ui/core/Button";
import {DelegateModal} from "./WalletStake";
import {AppCommon} from "../contexts/AppCommon";
import Link from "next/link";
import {useRouter} from "next/router";

const str = `
{"operationName":"indexers","variables":{"orderBy":"stakedTokens","orderDirection":"desc","first":500,"skip":0},"query":"query indexers($orderBy: Indexer_orderBy, $orderDirection: OrderDirection, $first: Int, $skip: Int, $where: Indexer_filter, $searchText: String, $addressSearchText: String) {\\n  indexers(orderBy: $orderBy, orderDirection: $orderDirection, first: $first, skip: $skip, where: $where) {\\n    id\\n    createdAt\\n    account {\\n      id\\n      defaultName {\\n        id\\n        name\\n        __typename\\n      }\\n      image\\n      __typename\\n    }\\n    allocations(first: 1000, orderBy: allocatedTokens, orderDirection: desc, where: {status: Active}) {\\n      id\\n      subgraphDeployment {\\n        id\\n        versions(orderBy: createdAt, orderDirection: desc, first: 1) {\\n          id\\n          subgraph {\\n            id\\n            image\\n            displayName\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    stakedTokens\\n    allocatedTokens\\n    delegatedTokens\\n    lockedTokens\\n    delegationExchangeRate\\n    delegatorParameterCooldown\\n    lastDelegationParameterUpdate\\n    queryFeeCut\\n    queryFeeRebates\\n    delegatorQueryFees\\n    indexingRewardCut\\n    indexingRewardEffectiveCut\\n    queryFeesCollected\\n    rewardsEarned\\n    url\\n    __typename\\n  }\\n}\\n"}
`
const queryVariables = {
    orderBy: "stakedTokens",
    orderDirection: "desc",
    first: 500,
    skip: 0,
};

const query = gql`
query indexers($orderBy: Indexer_orderBy, $orderDirection: OrderDirection, $first: Int, $skip: Int, $where: Indexer_filter, $searchText: String, $addressSearchText: String) {
  indexers(orderBy: $orderBy, orderDirection: $orderDirection, first: $first, skip: $skip, where: $where) {
    id
    createdAt
    account {
      id
      defaultName {
        id
        name
        __typename
      }
      image
      __typename
    }
    allocations(first: 1000, orderBy: allocatedTokens, orderDirection: desc, where: {status: Active}) {
      id
      subgraphDeployment {
        id
        versions(orderBy: createdAt, orderDirection: desc, first: 1) {
          id
          subgraph {
            id
            image
            displayName
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    stakedTokens
    allocatedTokens
    delegatedTokens
    lockedTokens
    delegationExchangeRate
    delegatorParameterCooldown
    lastDelegationParameterUpdate
    queryFeeCut
    queryFeeRebates
    delegatorQueryFees
    indexingRewardCut
    indexingRewardEffectiveCut
    queryFeesCollected
    rewardsEarned
    url
    __typename
  }
}`;

const headers = [
    {
        id: 'indexer',
        label: 'Indexer',
        width: 50,
    },
    {
        id: 'subgraphs',
        label: 'Subgraphs',
        width: 50,
    },
    {
        id: 'queryFeeCut',
        label: 'Query Fee Cut',
        width: 50,
    },
    {
        id: 'effectiveRewardCut',
        label: 'Effective Reward Cut',
        width: 50,
    },
    {
        id: 'cooldownRemained',
        label: 'Cooldown Remained',
        width: 50,
    },
    {
        id: 'owned',
        label: 'Owned',
        width: 50,
    },
    {
        id: 'delegated',
        label: 'Delegated',
        width: 50,
    },
    {
        id: 'allocated',
        label: 'Allocated',
        width: 50,
    },
    // {
    //     id: 'available',
    //     label: 'Available',
    // },
    // {
    //     id: 'maxCapacity',
    //     label: 'Max Capacity',
    // },
    {
        id: 'queryFees',
        label: 'Query Fees',
        width: 50,
    },
    {
        id: 'indexerRewards',
        label: 'Indexer Rewards',
        width: 50,
    },
    {
        id: 'actions',
        label: 'Actions',
        width: 50,
    },
] as const;

const getSubgraphImages = (indexer: IndexersEntity) => {
    if (!indexer.allocations) {
        return null;
    }
    return indexer.allocations
        .map(subgraph => {
            if (!subgraph?.subgraphDeployment.versions) {
                return [];
            }
            return subgraph.subgraphDeployment.versions.map(version => ({
                image: version?.subgraph.image,
                name: version?.subgraph.displayName,
            }))
        })
        .flat()
        .filter(({name, image}) => name || image)
        .filter((item, index, self) => {
            return (index === self.findIndex(t => (
                t.image === item.image
            )))
        })
        .map(({image, name}) => {
            if (image) {
                return (<img height="20px" width="20px" src={image} alt={name || ''}/>)
            }
            return <></>
        })
}

const mapToTableData = (data: IndexersResponse['data'], onDelegate: (indexerId: string) => void): StandardTableRows<typeof headers> => {
    return data?.indexers?.map((indexer: IndexersEntity) => ({
        indexer: indexer.account?.defaultName?.name || truncateMiddle(indexer.account.id),
        subgraphs: getSubgraphImages(indexer),
        queryFeeCut: `${(indexer.queryFeeCut / 10 ** 4).toFixed(0)}%`,
        effectiveRewardCut: `${(parseFloat(indexer.indexingRewardEffectiveCut) * 10 ** 2).toFixed(0)}%`,
        cooldownRemained: indexer.delegatorParameterCooldown,
        owned: formatToken(indexer.stakedTokens),
        delegated: formatToken(indexer.delegatedTokens),
        allocated: formatToken(indexer.allocatedTokens),
        queryFees: formatToken(indexer.queryFeeRebates),
        indexerRewards: formatToken(indexer.rewardsEarned),
        actions:(
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => { onDelegate(indexer.account.id) }}
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

export const Indexers = () => {
    const classes = useIndexersStyles();
    const {data, loading, error} = useQuery<IndexersResponse['data']>(query, {
        variables: queryVariables,
    });
    const [tableData, setTableData] = useState<StandardTableRows<typeof headers>>([]);
    const { setValidator } = useContext(AppCommon);
    const router = useRouter();


    const onDelegate = useCallback((indexerId: string) => {
        setValidator?.(indexerId);
        router.push('/staking');
    }, []);

    useEffect(() => {
        if (data) {
            setTableData(mapToTableData(data, onDelegate));
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
}