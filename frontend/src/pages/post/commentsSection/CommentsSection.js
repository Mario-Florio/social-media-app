import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./commentsSection.css";
import Loader from "../../../components/loader/Loader";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/methods/config";
import { populateComments } from "../../../serverRequests/methods/comments";
const { getPost } = requests.posts;
const { postComment } = requests.comments;

function CommentsSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const res = await getPost({ id: postId });
            if (res.success) {
                const comments = await populateComments(res.post.comments.reverse());
                setComments(comments);
            }
            setIsLoading(false);
        })();
    }, [postId]);

    return(
        <section className="comments-section">
            <ul>
                { isLoading ?
                    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                        <Loader/>
                    </div> :
                    comments.map(comment => 
                        <li key={comment._id}>
                            <Comment comment={comment}/>
                        </li>)
                }
            </ul>
            <footer>
                <Form postId={postId} comments={comments} setComments={setComments}/>
            </footer>
            <div style={{ height: "1px" }}></div>
        </section>
    );
}

export default CommentsSection;

function Form({ postId, comments, setComments }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const { user, token } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const res = await postComment({ postId, comment: { user: user._id, text: input }, token });

        if (res.success) {
            const populatedComment = await populateComments([res.comment._id]);
            setComments(comments.reverse().concat(populatedComment).reverse());
        }

        setIsLoading(false);
        setInput("");
    }
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="comment" className="hide">Comment</label>
            <textarea
                name="comment"
                id="comment"
                placeholder="Write something..."
                value={input}
                onChange={handleChange}
            />
            <button disabled={isLoading}>{ isLoading ?
                <Loader color="white" secondaryColor="var(--secondary-color)" size={32}/> :
                "Send" }</button>
        </form>
    );
}

function Comment({ comment }) {
    return(
        <article className="comment">
            <Link to={`/users/${comment.user._id}`} className="profile-pic_wrapper">
                <img src={comment.user.profile.picture} alt="user profile pic"/>
            </Link>
            <div>
                <Link to={`/users/${comment.user._id}`}>
                    <h4>{comment.user.username}</h4>
                </Link>
                <p>{comment.text}</p>
            </div>
        </article>
    );
}
