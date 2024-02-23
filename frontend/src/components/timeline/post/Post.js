import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import "./likesSection.css";
import "./optionsSection.css";
import { useAuth } from "../../../hooks/useAuth";

import { populateUsers } from "../../../serverRequests/methods/users";
import requests from "../../../serverRequests/methods/config";
const { putPostLike } = requests.posts;

export function Post({ post, setParentState }) {
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [likeIds, setLikeIds] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const { user } = useAuth();

    function viewLikes() {
        setLikeIds(post.likes);
        post.likes.length && setLikesSectionIsActive(true);
    }

    async function like() {
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
                        onClick={like}
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
            <OptionsSection
                optionsSectionIsActive={optionsSectionIsActive}
                setOptionsSectionIsActive={setOptionsSectionIsActive}
            />
            <LikesSection
                likeIds={likeIds}
                likesSectionIsActive={likesSectionIsActive}
                setLikesSectionIsActive={setLikesSectionIsActive}
            />
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
        <div className={likesSectionIsActive ? "likes-section_mask active" : "likes-section_mask"}>
            <section className="likes-section">
                <header>
                    <div
                        onClick={() => setLikesSectionIsActive(false)}
                        className="close-icon_wrapper"
                    >
                        <div className="bar-1"></div>
                        <div className="bar-2"></div>
                    </div>
                </header>
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
            </section>
        </div>
    );
}

function OptionsSection({ optionsSectionIsActive, setOptionsSectionIsActive }) {

    return(
        <div className={optionsSectionIsActive ? "options-section_mask active" : "options-section_mask"}>
            <section className="options-section">
                <header>
                    <div
                        onClick={() => setOptionsSectionIsActive(false)}
                        className="close-icon_wrapper"
                    >
                        <div className="bar-1"></div>
                        <div className="bar-2"></div>
                    </div>
                </header>
                <ul>
                    <li>Delete Post</li>
                    <li>Like Post</li>
                    <li>View Comments</li>
                    <li>Share Post</li>
                </ul>
            </section>
        </div>
    );
}
