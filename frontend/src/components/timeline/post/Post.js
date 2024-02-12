import { Link } from "react-router-dom";
import "./post.css";
import "./likesSection.css";

import { getLikes } from "../../../mockDB/methods/users";

export function Post({ post, setLikes, setLikesSectionIsActive }) {
    const { user } = post;

    function handleClick() {
        const likes = getLikes(post);
        setLikes(likes);
        likes.length && setLikesSectionIsActive(true);
    }

    return(
        <article className="post">
            <header>
                {user.profile._id ? 
                    <Link to={`/profile/${user.profile._id}`} className="profilePic-wrapper">
                        <div className="profilePic_wrapper">
                            <img src={user.profile.picture} alt="users profile pic"/>
                        </div>
                    </Link> :
                    <div className="loadingBGColor profilePic_wrapper"></div>}
                <div className="title">
                    <Link to={`/profile/${user.profile._id}`}>
                        <h3>{user.username}</h3>
                    </Link>
                    <span>Time passed</span>
                </div>
            </header>
            <p>{post.text}</p>
            <footer>
                <div className="top">
                        <span
                            onClick={handleClick}
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
                        <span>Like</span>
                        <Link to={post._id && `/post/${post._id}`}>
                            Comment
                        </Link>
                        <span>Share</span>
                </div>
            </footer>
        </article>
    );
}

export function LikesSection({ likes, likesSectionIsActive, setLikesSectionIsActive }) {
    return(
        <section className={likesSectionIsActive ? "likes-section active" : "likes-section"}>
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
                {
                    likes.map(like =>
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
                    )    
                }
            </ul>
        </section>
    );
}
