import { createContext, useContext, useEffect, useState } from "react";
import requests from "../serverRequests/methods/config";

const { getPost, getPosts } = requests.posts;

export const TimelineContext = createContext();

export const TimelineProvider = ({ queryBody, postId, children }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loaderPosts, setLoaderPosts] = useState(getLoaderPosts(10));

    useEffect(() => {
        postId && (async () => {
            try {
                setIsLoading(true);
                const res = await getPost({ id: postId });
                if (res.success) {
                    setPosts([res.post]);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [postId]);

    useEffect(() => {
        queryBody && (async () => {
            try {
                setIsLoading(true);
                setPosts(loaderPosts)
                const reqBody = {
                    queryBody: {
                        ...queryBody,
                        page
                    }
                }
                const res = await getPosts(reqBody);
                if (res.success) {
                    setPosts([...posts, ...res.posts]);
                    setLoaderPosts([...posts, ...res.posts, ...getLoaderPosts(10)]);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [page]);

    const value = {
        posts,
        setPosts,
        page,
        setPage,
        isLoading
    };

    return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};

export const useTimeline = () => {
    return useContext(TimelineContext);
};

function getLoaderPosts(amount) {
    const placeholderPosts = [];
    for (let i = 0; i < amount; i++) {
        const placeholderPost = { _id: uid(), user: { profile: {} }, text: "", comments: [], likes: [], loading: true };
        placeholderPosts.push(placeholderPost);
    }

    return placeholderPosts;

    function uid() {
        const uid = Date.now().toString(36) +
            Math.random().toString(36).substring(2).padStart(12, 0);
            
        return uid;
    }
}