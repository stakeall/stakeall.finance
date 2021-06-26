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
import {BitstakeProvider} from "../components/BitstakeProvider";
import {AppCommonProvider} from "../components/AppCommonProvider";
import {PageLoader} from "../components/PageLoader";
import {Header} from "../components/Header";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider);
}

export default function NextWeb3App({Component, pageProps}: AppProps) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ApolloProvider client={GraphClient}>
                <AppCommonProvider>
                    <BitstakeProvider >
                        <Layout>
                            <PageLoader >
                                <HeadTags />
                                <Header/>
                                <Component {...pageProps} />
                            </PageLoader>
                        </Layout>
                    </BitstakeProvider>
                </AppCommonProvider>
            </ApolloProvider>
        </Web3ReactProvider>
    );
}
