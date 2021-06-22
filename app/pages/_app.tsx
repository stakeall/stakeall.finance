import React from "react";
import type {
    ExternalProvider,
    JsonRpcFetchFunc,
} from "@ethersproject/providers";
import {Web3Provider} from "@ethersproject/providers";
import {Web3ReactProvider} from "@web3-react/core";
import type {AppProps} from "next/app";
import {ApolloProvider} from "@apollo/client";
import {GraphClient} from "../api/graphQl/apolloClient"

import Layout from "../uiComponents/Layout";
import {HeadTags} from "../components/HeadTags";

import '../css/global.css';

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider);
}

export default function NextWeb3App({Component, pageProps}: AppProps) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ApolloProvider client={GraphClient}>
                <Layout>
                    <HeadTags />
                    <Component {...pageProps} />
                </Layout>
            </ApolloProvider>
        </Web3ReactProvider>
    );
}
