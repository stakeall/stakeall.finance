import React, {useMemo, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {GraphIndexers} from "./GraphIndexers";
import {ProtocolCards} from "./ProtocolCards";
import {GRAPH, MATIC} from "../constants/Protocols";
import {MaticIndexers} from "./MaticIndexers";

const useIndexersStyles = makeStyles((theme) =>
    createStyles({
    })
)

export const Indexers: React.FC = () => {
    const classes = useIndexersStyles();
    const [selectedProtocol, setSelectedProtocol] = useState<string>('');
    if (!selectedProtocol) {
        return <ProtocolCards setSelectedProtocol={setSelectedProtocol} />;
    }
    else if (selectedProtocol === GRAPH) {
        return <GraphIndexers />;
    }
    else if (selectedProtocol === MATIC) {
        return <MaticIndexers />;
    }
    else {
        return null;
    }
}
