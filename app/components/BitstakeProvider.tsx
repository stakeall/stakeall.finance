import {useBitstake} from "../hooks/useBitstake";
import {Bitstake} from "../contexts/Bitstake";
import {useInactiveListener} from "../hooks/useInactiveListeners";

export const BitstakeProvider: React.FC = ({ children }) => {
    const bitstakeValue = useBitstake();
    useInactiveListener();
    return (
        <Bitstake.Provider value={bitstakeValue}>
            {children}
        </Bitstake.Provider>);
}