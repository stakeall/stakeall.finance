import React, {useContext, useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {GraphIndexers} from "./GraphIndexers";
import {ProtocolCards} from "./ProtocolCards";
import {MaticIndexers} from "./MaticIndexers";
import {StakingProtocol} from "../hooks/useBitstake";
import {AppCommon} from "../contexts/AppCommon";

const useIndexersStyles = makeStyles((theme) =>
    createStyles({
    })
)

export const Indexers: React.FC = () => {
    const classes = useIndexersStyles();
    const {protocol, setProtocol} = useContext(AppCommon);
    useEffect(() => {
        setProtocol?.(undefined);
    }, []);

    useEffect(() => {
        console.log({protocol});
    }, [protocol]);

    if (!protocol) {
        return <ProtocolCards />;
    }
    else if (protocol === StakingProtocol.GRAPH) {
        return <GraphIndexers />;
    }
    else if (protocol === StakingProtocol.MATIC) {
        return <MaticIndexers />;
    }
    else {
        return null;
    }
}
