import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./commentsSection.css";

import { getComments } from "../../../dummyData";

function CommentsSection({ post }) {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const comments = getComments(post);
        setComments(comments);
    }, [post]);

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInput("");
    }
    return(comments &&
        <section className="comments-section">
            <ul>
                {
                    comments.map(comment => <li key={comment._id}><Comment comment={comment}/></li>)
                }
            </ul>
            <footer>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="comment"className="hide">Comment</label>
                    <textarea
                        name="comment"
                        id="comment"
                        placeholder="Write something..."
                        value={input}
                        onChange={handleChange}
                    />
                    <button>Send</button>
                </form>
            </footer>
            <div style={{ height: "1px" }}></div>
        </section>
    );
}

export default CommentsSection;

function Comment({ comment }) {
    return(
        <article className="comment">
            <Link to={`/profile/${comment.user.profile._id}`} className="profile-pic_wrapper">
                <img src={comment.user.profile.pic} alt="user profile pic"/>
            </Link>
            <div>
                <Link to={`/profile/${comment.user.profile._id}`}>
                    <h4>{comment.user.username}</h4>
                </Link>
                <p>{comment.text}</p>
            </div>
        </article>
    );
}
