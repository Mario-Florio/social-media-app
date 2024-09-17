import { useState } from "react";
import "./postsFeed.css";
import { Link } from "react-router-dom";
import ImgHandler from "../imgHandler/ImgHandler";
import photoExists from "../imgHandler/__utils__/photoExists";
import Post from "../post/Post";
import Loader from "../loader/Loader";
import { useResponsePopup } from "../../hooks/useResponsePopup";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";

import requests from "../../serverRequests/requests";
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
    const { posts, setPosts } = usePosts();
    const { user, token } = useAuth();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

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
            setPosts([res.post, ...posts]);
            setInput("");
        } else {
            setResponsePopupData({ message: res.message, success: res.success });
            setResponsePopupIsActive(true);
        }
        setIsLoading(false);
    }

    return(
        <article className="newPost">
            <div className="flexbox">
                <Link to={`/users/${user._id}`} className="profilePic-wrapper">
                    <ImgHandler src={photoExists(user.profile.picture)} type="profile"/>
                </Link>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="newPost" className="hide">New Post</label>
                    <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                    <button disabled={isLoading || !forumId || posts.filter(post => post.loading).length > 0}>
                        { isLoading ? <Loader color="var(--secondary-color)" secondaryColor="white" size={29}/> : "Post" }
                    </button>
                </form>
            </div>
        </article>
    );
}
