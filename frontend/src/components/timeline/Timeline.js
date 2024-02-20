import { useState } from "react";
import { Link } from "react-router-dom";
import "./timeline.css";
import { Post, LikesSection } from "./post/Post";
import { useAuth } from "../../hooks/useAuth";

import requests from "../../serverRequests/methods/config";
const { postPost } = requests.posts;

function Timeline({ posts, setTimeline, forumId }) {
    const [likes, setLikes] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    return(
        <section className="timeline">
            <NewPost setTimeline={setTimeline} forumId={forumId}/>
            <ul className="feed">
                { posts.map(post =>
                        <li key={post._id}>
                            <Post
                                post={post}
                                setLikes={setLikes}
                                setLikesSectionIsActive={setLikesSectionIsActive}
                            />
                        </li>) }
                { posts.length >= 10 && <li className="seeMore">
                    <Link style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</Link>
                </li> }
            </ul>
            <LikesSection
                likes={likes}
                likesSectionIsActive={likesSectionIsActive}
                setLikesSectionIsActive={setLikesSectionIsActive}
            />
        </section>
    );
}

export default Timeline;

function NewPost({ setTimeline, forumId }) {
    const [input, setInput] = useState("");
    const { user } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await postPost({ user, text: input.trim() }, forumId);

        setInput("");

        await setTimeline();
    }

    return(
        <article className="newPost">
            <Link to={`/profile/${user.profile._id}`} className="profilePic-wrapper">
                <img src={user.profile.picture} alt="users profile pic"/>
            </Link>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                <button>Post</button>
            </form>
        </article>
    );
}
