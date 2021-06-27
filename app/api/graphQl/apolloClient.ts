import { ApolloClient, InMemoryCache } from "@apollo/client";

export const GraphClient = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet",
    cache: new InMemoryCache(),
});

