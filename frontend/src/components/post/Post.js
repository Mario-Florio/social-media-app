import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import "./likesSection.css";
import "./optionsSection.css";
import "./editSection.css";
import Loader from "../loader/Loader";
import SectionWrapper from "../sectionWrapper/SectionWrapper";
import { useResponsePopup } from "../../hooks/useResponsePopup";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { defaultProfilePic } from "../../defaultImages/defaultImages";

import requests from "../../serverRequests/methods/config";
const { putPost, putPostLike } = requests.posts;
const { getUsers } = requests.users;

const placeholderPost = { _id: null, user: { username: "Post unable to load", profile: {} }, text: "", comments: [], likes: [] };

function Post({ postId }) {
    const [post, setPost] = useState(null);
    const [likeIds, setLikeIds] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [editSectionIsActive, setEditSectionIsActive] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { user, token } = useAuth();
    const { posts } = usePosts();

    useEffect(() => {
        const [ post ] = posts.filter(post => post._id === postId);
        post ? setPost(post) : setPost(placeholderPost)

        return () => {
            setPost(null);
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
            } else {
                setResponsePopupData({ message: res.message, success: res.success });
                setResponsePopupIsActive(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(post &&
        <article className="post">
            <header>
                <div className="details">
                    { post.loading ?
                        <div className="loadingBGColor profilePic_wrapper"></div> :
                        <Link to={`/users/${post.user._id}`} className="profilePic_wrapper">
                            <img src={ post.user.profile.picture ? (post.user.profile.picture.url || defaultProfilePic.url) : defaultProfilePic.url } alt="users profile pic"/>
                        </Link> }
                    { post.loading ?
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
                postId={postId}
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

function LikesSection({ postId, likeIds, likesSectionIsActive, setLikesSectionIsActive }) {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const queryBody = {
                    populate: {
                        model: "Post",
                        _id: postId,
                        fields: ["likes"]
                    }
                };
                const res = await getUsers({ queryBody });
                if (res.success) {
                    setLikes(res.users);
                } else {
                    setResponsePopupData({ message: res.message, success: res.success });
                    setResponsePopupIsActive(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [postId, likeIds]);

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
                                        <img src={ like.profile.picture ? (like.profile.picture.url || defaultProfilePic.url) : defaultProfilePic.url } alt="users profile pic"/>
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
    const { posts, setPosts } = usePosts();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    async function deletePost() {
        setIsLoading(true);

        const res = await requests.posts.deletePost({ id: post._id, token });

        if (res.success) {
            const filteredPosts = posts.filter(p => p._id !== post._id);
            setPosts(filteredPosts);
            setConfirmDeletePopupIsActive(false);
            setOptionsSectionIsActive(false);
        }

        setIsLoading(false);
        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
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
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

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
        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
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
    );
}

export default Post;