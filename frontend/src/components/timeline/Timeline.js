import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./timeline.css";
import Post from "./post/Post";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import requests from "../../serverRequests/methods/config";
import { populatePosts } from "../../serverRequests/methods/posts";
const { postPost } = requests.posts;

function Timeline({ forumId }) {
    const [posts, setPosts] = useState([]);
    const { postIds } = useTimeline();

    useEffect(() => {
        (async () => {
            try {
                await setTimeline();
            } catch (err) {
                console.log(err);
            }
        })();
    }, [postIds]);

    async function setTimeline() {
        const timeline = await populatePosts(postIds);
        timeline.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(timeline);
    };

    return(
        <section className="timeline">
            <NewPost forumId={forumId}/>
            <ul className="feed">
                { posts.map(post =>
                    <li key={post._id}>
                        <Post
                            post={post}
                            setParentState={setTimeline}
                        />
                    </li>) }
                { posts.length >= 10 && 
                    <li className="seeMore">
                        <Link style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</Link>
                    </li> }
            </ul>
        </section>
    );
}

export default Timeline;

function NewPost({ forumId }) {
    const [input, setInput] = useState("");
    const { postIds, setPostIds } = useTimeline();
    const { user } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await postPost({ user: user._id, text: input.trim() }, forumId);
        setPostIds([...postIds, res.post._id]);

        setInput("");
    }

    return(
        <article className="newPost">
            <Link to={`/profile/${user.profile._id}`} className="profilePic-wrapper">
                <img src={ user.profile.picture || "../../assets/imgs/default/profile-picture.jpg" } alt="users profile pic"/>
            </Link>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                <button>Post</button>
            </form>
        </article>
    );
}
