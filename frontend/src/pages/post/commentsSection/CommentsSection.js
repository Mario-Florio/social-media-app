import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./commentsSection.css";

import getData from "../../../dummyData";

function CommentsSection({ post }) {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const comments = getComments();
        setComments(comments);

        function getComments() {
            const { comments, users } = getData();

            const commentsArr = [];

            post.comments.forEach(postComment => {
                comments.forEach(comment => {
                    if (comment._id === postComment) {
                        commentsArr.push(comment);
                    }
                });
            });

            populateUsers(commentsArr);

            return commentsArr;

            function populateUsers(comments) {
                comments.forEach(comment => {
                    let userData = null;
                    users.forEach(user => {
                        if (user._id === comment.user) {
                            userData = user;
                        }
                    });
                    comment.user = userData;
                });
            }
        }
    }, [post.comments]);

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
