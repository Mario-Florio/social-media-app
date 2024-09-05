import { useEffect, useState } from "react";
import "./post.css";
import { Link } from "react-router-dom";
import ImgHandler from "../imgHandler/ImgHandler";
import photoExists from "../imgHandler/__utils__/photoExists";
import OptionsSection from "./optionsSection/OptionsSection";
import LikesSection from "./likesSection/LikesSection";
import EditSection from "./editSection/EditSection";
import { useResponsePopup } from "../../hooks/useResponsePopup";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";

import requests from "../../serverRequests/requests";
const { putPostLike } = requests.posts;

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
                            <ImgHandler src={photoExists(post.user.profile.picture)} type="profile"/>
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
                    <span onClick={viewLikes} style={{ cursor: "pointer" }}>
                        {post.likes.length} likes
                    </span>
                    <Link to={post._id && `/post/${post._id}`}>
                        {post.comments.length} comments
                    </Link>
                </div>
                <hr/>
                <div className="bottom">
                    <span onClick={async () => await likePost()} style={{ cursor: "pointer" }}>
                        { post.likes.includes(user._id) ? "Unlike" : "Like" }
                    </span>
                    <Link to={post._id && `/post/${post._id}`}>
                        Comment
                    </Link>
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

export default Post;