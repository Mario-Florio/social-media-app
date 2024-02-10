import { useState } from "react";
import { Link } from "react-router-dom";
import "./timeline.css";
import { Post, LikesSection } from "./post/Post";
import { useAuth } from "../../hooks/useAuth";

function Timeline({ posts }) {
    const [likes, setLikes] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    return(
        <section className="timeline">
            <NewPost/>
            <ul className="feed">
                {
                    posts.map(post =>
                        <li key={post._id}>
                            <Post
                                post={post}
                                setLikes={setLikes}
                                setLikesSectionIsActive={setLikesSectionIsActive}
                            />
                        </li>)
                }
                <li className="seeMore">
                    <Link style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</Link>
                </li>
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

function NewPost() {
    const [input, setInput] = useState("");
    const { user } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInput("");
    }

    return(
        <article className="newPost">
            <Link to={`/profile/${user.profile._id}`} className="profilePic-wrapper">
                <img src={user.profile.pic} alt="users profile pic"/>
            </Link>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                <button>Post</button>
            </form>
        </article>
    );
}
