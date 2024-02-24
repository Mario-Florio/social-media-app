import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import "./likesSection.css";
import "./optionsSection.css";
import "./editSection.css";
import { useAuth } from "../../../hooks/useAuth";
import { useTimeline } from "../../../hooks/useTimeline";

import { populateUsers } from "../../../serverRequests/methods/users";
import requests from "../../../serverRequests/methods/config";
import SectionWrapper from "./sectionWrapper/SectionWrapper";
const { putPost, putPostLike } = requests.posts;

function Post({ post, setParentState }) {
    const [likeIds, setLikeIds] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [editSectionIsActive, setEditSectionIsActive] = useState(false);
    const { user } = useAuth();

    function viewLikes() {
        setLikeIds(post.likes);
        post.likes.length && setLikesSectionIsActive(true);
    }

    async function likePost() {
        try {
            const res = await putPostLike(post._id, user._id);
            if (res.success) {
                await setParentState();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <article className="post">
            <header>
                <div className="details">
                    { post.user.profile._id ? 
                        <Link to={`/profile/${post.user.profile._id}`} className="profilePic_wrapper">
                            <img src={post.user.profile.picture} alt="users profile pic"/>
                        </Link> :
                        <div className="loadingBGColor profilePic_wrapper"></div> }
                    <div className="title">
                        <Link to={post.user.profile._id && `/profile/${post.user.profile._id}`}>
                            <h3>{post.user.username}</h3>
                        </Link>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div
                    className="options"
                    onClick={() => setOptionsSectionIsActive(true)}
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </header>
            <p>{post.text}</p>
            <footer>
                <div className="top">
                    <span
                        onClick={viewLikes}
                        style={{ cursor: "pointer" }}
                    >
                        {post.likes.length} likes
                    </span>
                    <Link to={post._id && `/post/${post._id}`}>
                        {post.comments.length} comments
                    </Link>
                    <span># shares</span>
                </div>
                <hr/>
                <div className="bottom">
                    <span
                        onClick={async () => await likePost()}
                        style={{ cursor: "pointer" }}
                    >
                        { post.likes.includes(user._id) ? "Unlike" : "Like" }
                    </span>
                    <Link to={post._id && `/post/${post._id}`}>
                        Comment
                    </Link>
                    <span>Share</span>
                </div>
            </footer>
            { likesSectionIsActive && <LikesSection
                likeIds={likeIds}
                likesSectionIsActive={likesSectionIsActive}
                setLikesSectionIsActive={setLikesSectionIsActive}
            /> }
            { optionsSectionIsActive && <OptionsSection
                likePost={likePost}
                post={post}
                optionsSectionIsActive={optionsSectionIsActive}
                setOptionsSectionIsActive={setOptionsSectionIsActive}
                setEditSectionIsActive={setEditSectionIsActive}
            /> }
            { editSectionIsActive && <EditSection
                post={post}
                editSectionIsActive={editSectionIsActive}
                setEditSectionIsActive={setEditSectionIsActive}
                setParentState={setParentState}
            /> }
        </article>
    );
}

function LikesSection({ likeIds, likesSectionIsActive, setLikesSectionIsActive }) {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const likes = await populateUsers(likeIds);
                setLikes(likes);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [likeIds]);

    return(
        <SectionWrapper
            sectionClassName="likes-section"
            sectionIsActive={likesSectionIsActive}
            setSectionIsActive={setLikesSectionIsActive}
        >
            <ul>
                { likes.map(like =>
                    <li key={like._id}>
                        <Link 
                            to={`/profile/${like.profile._id}`}
                            onClick={() => setLikesSectionIsActive(false)}
                        >
                            <div className="profile_wrapper">
                                <img src={like.profile.picture} alt="users profile pic"/>
                                <h3>{like.username}</h3>
                            </div>
                        </Link>
                    </li>
                ) }
            </ul>
        </SectionWrapper>
    );
}

function OptionsSection({ likePost, post, optionsSectionIsActive, setOptionsSectionIsActive, setEditSectionIsActive }) {
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false)
    const { user } = useAuth();
    const { postIds, setPostIds } = useTimeline();

    async function deletePost() {
        const res = await requests.posts.deletePost(post._id);

        if (res.success) {
            const newPostIds = postIds.filter(postId => postId !== post._id);
            setPostIds(newPostIds);
            setConfirmDeletePopupIsActive(false);
            setOptionsSectionIsActive(false);
        }
    }

    async function editPost() {
        setEditSectionIsActive(true);
        setOptionsSectionIsActive(false);
    }

    return(
        <SectionWrapper
            sectionClassName="options-section"
            sectionIsActive={optionsSectionIsActive}
            setSectionIsActive={setOptionsSectionIsActive}
        >
            <ul>
                { post.user._id === user._id && <li onClick={() => setConfirmDeletePopupIsActive(true)}>Delete Post</li> }
                { post.user._id === user._id && <li onClick={async () => await editPost()}>Edit Post</li> }
                <li onClick={async () => await likePost()}>
                    { post.likes.includes(user._id) ? "Unlike Post" : "Like Post" }
                </li>
                <Link to={post._id && `/post/${post._id}`}>
                    <li>
                        View Comments
                    </li>
                </Link>
                <li>Share Post</li>
            </ul>
            <div className={ confirmDeletePopupIsActive ? "confirm-delete_popup active" : "confirm-delete_popup" }>
                <p>Are you sure you want to delete this post?</p>
                <button onClick={async () => await deletePost()}>Confirm</button>
                <button onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
            </div>
        </SectionWrapper>
    );
}

function EditSection({ post, editSectionIsActive, setEditSectionIsActive, setParentState }) {
    const [input, setInput] = useState(post.text);

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const updatedPost = {
            _id: post._id,
            user: post.user._id,
            text: input,
            likes: post.likes,
            comments: post.comments,
            createdAt: post.createdAt
        }

        const res = await putPost(updatedPost);

        if (res.success) {
            setInput(post.text);
            setEditSectionIsActive(false);
            setParentState();
        }
    }

    return(
        <SectionWrapper
            sectionClassName="edit-section"
            sectionIsActive={editSectionIsActive}
            setSectionIsActive={setEditSectionIsActive}
        >
            <form onSubmit={handleSubmit}>
                <textarea value={input} onChange={handleChange}/>
                <button>Submit</button>
            </form>
        </SectionWrapper>
    )
}

export default Post;