import { useState } from "react";
import { Link } from "react-router-dom";
import "./postsFeed.css";
import Post from "../post/Post";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import Loader from "../loader/Loader";

import requests from "../../serverRequests/methods/config";
const { postPost } = requests.posts;

function PostsFeed({ forumId, children }) {
    const sitePage = (
        window.location.pathname.includes("users") ? "users" :
        window.location.pathname.includes("post") ? "post" : "home"
    );
    const { setPage, posts } = usePosts();
    const postIds = posts.map(post => post._id);

    function seeMore() {
        setPage(page => page + 1);
    }

    return(
        <section className="posts-feed">
            <NewPost forumId={forumId}/>
            <ul className="feed">
                { postIds.map(postId =>
                    <li key={postId}>
                        <Post postId={postId}/>
                    </li>) }
                { postIds.length > 0 && postIds.length % 10 === 0 &&
                    <li className="seeMore">
                        <span onClick={seeMore}>See more...</span>
                    </li> }
                { sitePage !== "home" ? children :
                    postIds.length === 0 && sitePage === "home" && children }
            </ul>
        </section>
    );
}

export default PostsFeed;

function NewPost({ forumId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const { postIds, setPostIds } = usePosts();
    const { user, token } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (input.trim() < 3) return;
        setIsLoading(true);
        const res = await postPost({
            content: {
                user: user._id, text: input.trim(),
            },
            forumId,
            token
        });

        if (res.success) {
            setPostIds([...postIds, res.post._id].reverse());
            setInput("");
        }
        setIsLoading(false);
    }

    return(
        <article className="newPost">
            <Link to={`/users/${user._id}`} className="profilePic-wrapper">
                <img src={ user.profile.picture || "../../assets/imgs/default/profile-picture.jpg" } alt="users profile pic"/>
            </Link>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                <button disabled={isLoading}>
                    { isLoading ? <Loader color="var(--secondary-color)" secondaryColor="white" size={29}/> : "Post" }
                </button>
            </form>
        </article>
    );
}