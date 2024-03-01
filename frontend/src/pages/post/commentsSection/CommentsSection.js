import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./commentsSection.css";
import Loader from "../../../components/loader/Loader";

import requests from "../../../serverRequests/methods/config";
import { populateComments } from "../../../serverRequests/methods/comments";
const { getPost } = requests.posts;

const placeholderPost = { _id: null, user: { profile: {} }, text: "", comments: [], likes: [] };

function CommentsSection({ postId }) {
    const [post, setPost] = useState(placeholderPost)
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const post = await getPost(postId);
            const comments = await populateComments(post.comments);
            setPost(post);
            setComments(comments);
            setIsLoading(false);
        })();
    }, [postId]);

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
