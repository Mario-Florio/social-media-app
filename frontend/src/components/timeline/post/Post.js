import { Link } from "react-router-dom";
import "./post.css";

import getData from "../../../dummyData";

export function Post({ post, setLikes, setLikesSectionIsActive }) {
    const { user } = post;
    const { profile } = user;

    function handleClick() {
        const likes = getLikes();
        setLikes(likes);
        setLikesSectionIsActive(true);

        function getLikes() {
            const { users } = getData();
            let likes = [];
            post.likes.forEach(like => {
                users.forEach(user => {
                    if (user._id === like) {
                        likes.push(user);
                    }
                });
            });
            return likes;
        }
    }

    return(
        <article className="post">
            <header>
                <Link to={`/profile/${profile._id}`} className="profilePic-wrapper">
                    <img src={profile.pic} alt="users profile pic"/>
                </Link>
                <div className="title">
                    <Link to={`/profile/${profile._id}`}>
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
                        <Link to={`/post/${post._id}`}>
                            {post.comments.length} comments
                        </Link>
                        <span># shares</span>
                </div>
                <hr/>
                <div className="bottom">
                        <span>Like</span>
                        <Link to={`/post/${post._id}`}>
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
                                    <img src={like.profile.pic} alt="users profile pic"/>
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
