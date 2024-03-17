import { useState } from "react";
import { Link } from "react-router-dom";
import "./timeline.css";
import Post from "../post/Post";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";
import Loader from "../loader/Loader";

import requests from "../../serverRequests/methods/config";
const { postPost } = requests.posts;

function Timeline({ forumId, profileUser }) {
    const page = (
        window.location.pathname.includes("profile") ? "profile" :
        window.location.pathname.includes("post") ? "post" :
        "home"
    );
    const { postIds } = useTimeline();

    return(
        <section className="timeline">
            <NewPost forumId={forumId}/>
            <ul className="feed">
                { postIds.map(postId =>
                    <li key={postId}>
                        <Post postId={postId}/>
                    </li>) }
                { postIds.length >= 10 && 
                    <li className="seeMore">
                        <Link style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</Link>
                    </li> }
                { postIds.length === 0 && page === "home" &&
                    <article style={{ marginTop: "3rem" }}>
                        <h3
                            style={{
                                textAlign: "center",
                                color: "var(--secondary-font-color)",
                                fontWeight: "300",
                            }}
                        >
                            Looks like there is no activity
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                color: "var(--secondary-font-color)",
                                fontWeight: "300",
                            }}
                        >
                            Try searching for some friends to follow!
                        </p>
                    </article> }
                { page === "profile" && profileUser &&
                    <article style={{ padding: "1rem", marginBottom: "3rem", borderTop: "1px dashed var(--secondary-color)", borderBottom: "1px dashed var(--secondary-color)" }}>
                        <h3
                            style={{
                                textAlign: "center",
                                color: "var(--secondary-font-color)",
                                fontWeight: "300",
                            }}
                        >
                            { new Date(profileUser.createdAt).toLocaleDateString() }
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                color: "var(--secondary-font-color)",
                                fontWeight: "300",
                            }}
                        >
                            { `${profileUser.username} created there account!` }
                        </p>
                    </article> }
            </ul>
        </section>
    );
}

export default Timeline;

function NewPost({ forumId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const { postIds, setPostIds } = useTimeline();
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
            <Link to={`/profile/${user.profile._id}`} className="profilePic-wrapper">
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
