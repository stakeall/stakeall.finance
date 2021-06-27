import React from "react";
import type {
    ExternalProvider,
    JsonRpcFetchFunc,
} from "@ethersproject/providers";
import {Web3Provider} from "@ethersproject/providers";
import Web3 from 'web3'
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
import {ClientOnly} from "../components/ClientOnly";
import {InjectWeb3} from "../components/InjectWeb3";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider)
}

export default function NextWeb3App({Component, pageProps}: AppProps) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ApolloProvider client={GraphClient}>
                <ClientOnly>
                    <InjectWeb3 />
                    <AppCommonProvider>
                        <BitstakeProvider >
                            <Layout>
                                <HeadTags />
                                <Header/>
                                <PageLoader >
                                    <Component {...pageProps} />
                                </PageLoader>
                            </Layout>
                        </BitstakeProvider>
                    </AppCommonProvider>
                </ClientOnly>
            </ApolloProvider>
        </Web3ReactProvider>
    );
}
