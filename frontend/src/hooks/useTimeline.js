import { createContext, useContext, useMemo, useState } from "react";

const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
    const [postIds, setPostIds] = useState([]);

    const value = useMemo(() => ({
        postIds,
        setPostIds
    }),
    [postIds]);

    return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};

export const useTimeline = () => {
    return useContext(TimelineContext);
};