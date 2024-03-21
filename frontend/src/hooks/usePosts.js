import { createContext, useContext, useEffect, useState } from "react";
import requests from "../serverRequests/methods/config";

const { getPost, getPosts } = requests.posts;

export const PostsContext = createContext();

export const PostsProvider = ({ reqSpecs, children }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loaderPosts, setLoaderPosts] = useState(getLoaderPosts({
        postId: reqSpecs.method === "getPost" ? reqSpecs.reqBody.id : null,
        amount: reqSpecs.method === "getPost" ? 1 : 10
    }));

    useEffect(() => {
        reqSpecs.method === "getPost" && (async () => {
            try {
                const { reqBody } = reqSpecs;
                setPosts(loaderPosts);
                const res = await getPost(reqBody);
                if (res.success) {
                    setPosts([res.post]);
                }
            } catch (err) { 
                console.log(err);
            }
        })()
    }, [reqSpecs]);

    useEffect(() => {
        reqSpecs.method === "getPosts" && (async () => {
            try {
                const { reqBody } = reqSpecs;
                setPosts(loaderPosts);
                reqBody.queryBody.page = page;
                const res = await getPosts(reqBody);
                if (res.success) {
                    setPosts([...posts, ...res.posts]);
                    setLoaderPosts([
                        ...posts,
                        ...res.posts,
                        ...getLoaderPosts({ postId: null, amount: 10})
                    ]);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [page]);

    const value = {
        posts, setPosts,
        page, setPage
    };

    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
    return useContext(PostsContext);
};

function getLoaderPosts({ amount, postId }) {
    const placeholderPosts = [];
    for (let i = 0; i < amount; i++) {
        const placeholderPost = {
            _id: (amount === 1 && postId) || uid(),
            user: { profile: {} },
            text: "",
            comments: [],
            likes: [],
            loading: true
        };
        placeholderPosts.push(placeholderPost);
    }

    return placeholderPosts;

    function uid() {
        const uid = Date.now().toString(36) +
            Math.random().toString(36).substring(2).padStart(12, 0);
            
        return uid;
    }
}