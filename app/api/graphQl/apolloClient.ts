import { ApolloClient, InMemoryCache } from "@apollo/client";

export const GraphClient = new ApolloClient({
    uri: "https://gateway.testnet.thegraph.com/network",
    cache: new InMemoryCache(),
});

