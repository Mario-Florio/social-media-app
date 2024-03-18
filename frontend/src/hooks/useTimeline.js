import { createContext, useContext, useEffect, useState } from "react";
import requests from "../serverRequests/methods/config";

const { getPost, getPosts } = requests.posts;

export const TimelineContext = createContext();

export const TimelineProvider = ({ queryBody, postId, children }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        postId && (async () => {
            try {
                const res = await getPost({ id: postId });
                if (res.success) {
                    setPosts([res.post]);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [postId]);

    useEffect(() => {
        queryBody && (async () => {
            try {
                const reqBody = {
                    queryBody: {
                        ...queryBody,
                        page
                    }
                }
                const res = await getPosts(reqBody);
                if (res.success) {
                    page > 0 ? setPosts([...posts, ...res.posts]) : setPosts(res.posts);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [page]);

    const value = {
        posts,
        setPosts,
        page,
        setPage
    };

    return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};

export const useTimeline = () => {
    return useContext(TimelineContext);
};