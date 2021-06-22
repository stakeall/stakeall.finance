export interface IndexersResponse {
    data: Data;
}
export interface Data {
    indexers?: (IndexersEntity)[] | null;
}
export interface IndexersEntity {
    __typename: string;
    account: Account;
    allocatedTokens: string;
    allocations?: (AllocationsEntity | null)[] | null;
    createdAt: number;
    delegatedTokens: string;
    delegationExchangeRate: string;
    delegatorParameterCooldown: number;
    delegatorQueryFees: string;
    id: string;
    indexingRewardCut: number;
    indexingRewardEffectiveCut: string;
    lastDelegationParameterUpdate: number;
    lockedTokens: string;
    queryFeeCut: number;
    queryFeeRebates: string;
    queryFeesCollected: string;
    rewardsEarned: string;
    stakedTokens: string;
    url?: string | null;
}
export interface Account {
    __typename: string;
    defaultName?: DefaultName | null;
    id: string;
    image?: string | null;
}
export interface DefaultName {
    __typename: string;
    id: string;
    name: string;
}
export interface AllocationsEntity {
    __typename: string;
    id: string;
    subgraphDeployment: SubgraphDeployment;
}
export interface SubgraphDeployment {
    __typename: string;
    id: string;
    versions?: (VersionsEntity | null)[] | null;
}
export interface VersionsEntity {
    __typename: string;
    id: string;
    subgraph: Subgraph;
}
export interface Subgraph {
    __typename: string;
    displayName?: string | null;
    id: string;
    image?: string | null;
}
