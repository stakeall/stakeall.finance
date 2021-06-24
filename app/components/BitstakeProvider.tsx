import {useBitstake} from "../hooks/useBitstake";
import {Bitstake} from "../contexts/Bitstake";

export const BitstakeProvider: React.FC = ({ children }) => {
    const bitstakeValue = useBitstake();
    return (
        <Bitstake.Provider value={bitstakeValue}>
            {children}
        </Bitstake.Provider>);
}