import { createContext, useContext, useState } from "react";
import ResponsePopup from "../components/responsePopup/ResponsePopup";

const ResponsePopupContext = createContext();

export const ResponsePopupProvider = ({ children }) => {
    const [responsePopupIsActive, setResponsePopupIsActive] = useState(false);
    const [responsePopupData, setResponsePopupData] = useState({ message: "", success: true });

    const value = {
        setResponsePopupIsActive,
        setResponsePopupData
    }

    return(
        <ResponsePopupContext.Provider value={value}>
            {children}
            { responsePopupIsActive &&
                <ResponsePopup
                    message={responsePopupData.message}
                    success={responsePopupData.success}
                    setIsMounted={setResponsePopupIsActive}
                /> }
        </ResponsePopupContext.Provider>
    );
};

export const useResponsePopup = () => {
    return useContext(ResponsePopupContext);
};
