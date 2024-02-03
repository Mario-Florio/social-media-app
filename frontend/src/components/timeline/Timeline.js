import { useState } from "react";
import { Link } from "react-router-dom";
import "./timeline.css";
import { useAuth } from "../../hooks/useAuth";

function Timeline({ posts }) {
    return(
        <section>
            <NewPost/>
            <ul className="timeline">
                { posts.map(post => <li key={post._id}><Post post={post}/></li>) }
                <li style={{ textAlign: "center", margin: "3rem" }}>
                    <Link style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</Link>
                </li>
            </ul>
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

function Post({ post }) {
    const { user } = post;
    const { profile } = user;

    return(
        <article className="post">
            <header>
                <Link to={`/profile/${profile._id}`} className="profilePic-wrapper">
                    <img src={profile.pic} alt="users profile pic"/>
                </Link>
                <div className="title">
                    <Link to={`/profile/${profile._id}`}>
                        <h3>{user.username}</h3>
                    </Link>
                    <span>Time passed</span>
                </div>
            </header>
            <p>{post.text}</p>
            <footer>
                <div className="top">
                    <Link>
                        <span># likes</span>
                    </Link>
                    <Link>
                        <span># comments</span>
                    </Link>
                    <Link>
                        <span># shares</span>
                    </Link>
                </div>
                <hr/>
                <div className="bottom">
                    <Link>
                        <span>Like</span>
                    </Link>
                    <Link>
                        <span>Comment</span>
                    </Link>
                    <Link>
                        <span>Share</span>
                    </Link>
                </div>
            </footer>
        </article>
    );
}
