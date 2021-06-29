import React, {useMemo, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/styles";
import {GraphIndexers} from "./GraphIndexers";
import {ProtocolCards} from "./ProtocolCards";
import {GRAPH} from "../constants/Protocols";

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
    else {
        return null;
    }
}
