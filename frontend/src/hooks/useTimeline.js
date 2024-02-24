import { createContext, useContext, useState } from "react";

const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
    const [postIds, setPostIds] = useState([]);

    const value = {
        postIds,
        setPostIds
    };

    return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};

export const useTimeline = () => {
    return useContext(TimelineContext);
};