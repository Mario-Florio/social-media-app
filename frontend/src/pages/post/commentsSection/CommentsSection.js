import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./commentsSection.css";
import Loader from "../../../components/loader/Loader";

import { getComments } from "../../../mockDB/methods/comments";

function CommentsSection({ post }) {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setData()
            .then(() => setIsLoading(false));

        async function setData() {
            await delay(3000);
            const comments = getComments(post);
            setComments(comments);

            // UTILS
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
        }
    }, [post]);

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInput("");
    }
    return(
        <section className="comments-section">
            <ul>
                { isLoading ?
                    <div
                        style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
                    ><Loader/></div> :
                    comments.map(comment => 
                        <li key={comment._id}>
                            <Comment comment={comment}/>
                        </li>)
                }
            </ul>
            <footer>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="comment" className="hide">Comment</label>
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
                <img src={comment.user.profile.picture} alt="user profile pic"/>
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
