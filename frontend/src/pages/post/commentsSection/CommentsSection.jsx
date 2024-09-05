import {  useState, useEffect } from "react";
import "./commentsSection.css";
import { Link } from "react-router-dom";
import ImgHandler from "../../../components/imgHandler/ImgHandler";
import photoExists from "../../../components/imgHandler/__utils__/photoExists";
import Loader from "../../../components/loader/Loader";
import OptionsSection from "./optionsSection/OptionsSection";
import EditSection from "./editSection/EditSection";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/requests";
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
                const comments = await populateComments(res.post.comments);
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
                            <Comment comment={comment} setComments={setComments}/>
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

function OptionsButton({ setOptionsSectionIsActive }) {
    return(
        <div
            className="options"
            onClick={() => setOptionsSectionIsActive(true)}
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

function Comment({ comment, setComments }) {
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [editSectionIsActive, setEditSectionIsActive] = useState(false);

    const { user } = useAuth();
    const isUser = comment.user._id === user._id;

    return(
        <article className="comment">
            <div className="flexbox">
                <Link to={`/users/${comment.user._id}`} className="profile-pic_wrapper">
                    <ImgHandler src={photoExists(comment.user.profile.picture)} type="profile"/>
                </Link>
                <div>
                    <Link to={`/users/${comment.user._id}`}>
                        <h4>{comment.user.username}</h4>
                    </Link>
                    <p style={{ color: "var(--secondary-font-color)", fontSize: ".9rem", marginBottom: ".25rem" }}>{new Date(comment.createdAt).toLocaleString()}</p>
                    <p>{comment.text}</p>
                </div>
            </div>
            { isUser && <OptionsButton setOptionsSectionIsActive={setOptionsSectionIsActive}/> }
            { optionsSectionIsActive && <OptionsSection
                comment={comment}
                setComments={setComments}
                optionsSectionIsActive={optionsSectionIsActive}
                setOptionsSectionIsActive={setOptionsSectionIsActive}
                setEditSectionIsActive={setEditSectionIsActive}
            /> }
            { editSectionIsActive && <EditSection
                comment={comment}
                setComments={setComments}
                editSectionIsActive={editSectionIsActive}
                setEditSectionIsActive={setEditSectionIsActive}
            /> }
        </article>
    );
}

function Form({ postId, comments, setComments }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const { user, token } = useAuth();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

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
        } else {
            setResponsePopupData({ message: res.message, success: res.success });
            setResponsePopupIsActive(true);
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
