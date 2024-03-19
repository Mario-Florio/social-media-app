import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import "./likesSection.css";
import "./optionsSection.css";
import "./editSection.css";
import Loader from "../loader/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import { populateUsers } from "../../serverRequests/methods/users";
import requests from "../../serverRequests/methods/config";
import SectionWrapper from "../sectionWrapper/SectionWrapper";
const { putPost, putPostLike } = requests.posts;

const placeholderPost = { _id: null, user: { profile: {} }, text: "", comments: [], likes: [] };

function Post({ postId }) {
    const [post, setPost] = useState(placeholderPost);
    const [likeIds, setLikeIds] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [editSectionIsActive, setEditSectionIsActive] = useState(false);
    const { user, token } = useAuth();
    const { posts, isLoading } = useTimeline();

    useEffect(() => {
        const [ post ] = posts.filter(post => post._id === postId);
        post && setPost(post);

        return () => {
            setPost(placeholderPost);
        }
    }, [posts, postId]);

    function viewLikes() {
        setLikeIds(post.likes);
        post.likes.length && setLikesSectionIsActive(true);
    }

    async function likePost() {
        try {
            const res = await putPostLike({ id: post._id, userId: user._id, token });
            if (res.success) {
                setPost(res.post);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <article className="post">
            <header>
                <div className="details">
                    { isLoading ?
                        <div className="loadingBGColor profilePic_wrapper"></div> :
                        <Link to={`/users/${post.user._id}`} className="profilePic_wrapper">
                            <img src={ post.user.profile.picture || "../../assets/imgs/default/profile-picture.jpg"} alt="users profile pic"/>
                        </Link> }
                    { isLoading ?
                        <div className="title">
                            <div className="loadingBGColor" style={{ height: "1rem", width: "150px", marginBottom: ".2rem", borderRadius: "5px" }}></div>
                            <div className="loadingBGColor" style={{ height: "1rem", width: "100px", borderRadius: "5px" }}></div>
                        </div> :
                        <div className="title">
                            <Link to={ post.user._id && `/users/${post.user._id}` }>
                                <h3>{post.user.username}</h3>
                            </Link>
                            <span>{ post.createdAt && new Date(post.createdAt).toLocaleString() }</span>
                        </div> }
                </div>
                <OptionsButton setOptionsSectionIsActive={setOptionsSectionIsActive}/>
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
                setPost={setPost}
            /> }
        </article>
    );
}

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

function LikesSection({ likeIds, likesSectionIsActive, setLikesSectionIsActive }) {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const likes = await populateUsers(likeIds);
                setLikes(likes);
                setIsLoading(false);
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
                { isLoading ?
                    likeIds.map(likeId => 
                        <li key={likeId}>
                            <div className="profile_wrapper">
                                <div className="loadingBGColor profile-pic_wrapper"></div>
                                <div className="loadingBGColor" style={{ height: "1rem", width: "40%", borderRadius: "5px" }}></div>
                            </div>
                        </li>
                    )
                        :
                    likes.map(like =>
                        <li key={like._id}>
                            <Link 
                                to={`/users/${like._id}`}
                                onClick={() => setLikesSectionIsActive(false)}
                            >
                                <div className="profile_wrapper">
                                    <div className="profile-pic_wrapper">
                                        <img src={like.profile.picture} alt="users profile pic"/>
                                    </div>
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
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false)
    const { user, token } = useAuth();
    const { postIds, setPostIds } = useTimeline();

    async function deletePost() {
        setIsLoading(true);

        const res = await requests.posts.deletePost({ id: post._id, token });

        if (res.success) {
            const newPostIds = postIds.filter(postId => postId !== post._id);
            setPostIds(newPostIds);
            setConfirmDeletePopupIsActive(false);
            setOptionsSectionIsActive(false);
        }

        setIsLoading(false);
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
            <div className={confirmDeletePopupIsActive ? "popup_mask active" : "popup_mask"}>
                <div className="confirm-delete_popup">
                    <p>Are you sure you want to delete this post?</p>
                    <button disabled={isLoading} onClick={async () => await deletePost()}>Confirm</button>
                    <button disabled={isLoading} onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
                </div>
            </div>
        </SectionWrapper>
    );
}

function EditSection({ post, editSectionIsActive, setEditSectionIsActive, setPost }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState(post.text);
    const { token } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const updatedPostFields = {
            text: input,
        }

        const res = await putPost({ id: post._id, update: updatedPostFields, token });

        if (res.success) {
            setInput(post.text);
            setEditSectionIsActive(false);
            setPost(res.post);
        }

        setIsLoading(false);
    }

    return(
        <SectionWrapper
            sectionClassName="edit-section"
            sectionIsActive={editSectionIsActive}
            setSectionIsActive={setEditSectionIsActive}
        >
            <form onSubmit={handleSubmit}>
                <textarea value={input} onChange={handleChange}/>
                <div className="button_wrapper">
                    { isLoading && <Loader size={25}/> }
                    <button disabled={isLoading}>Submit</button>
                </div>
            </form>
        </SectionWrapper>
    )
}

export default Post;