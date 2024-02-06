import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import { Post, LikesSection } from "../../components/timeline/post/Post";
import { useParams } from "react-router-dom";

import getData from "../../dummyData";

function PostPage() {
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const { posts } = getData();
        const post = getPost(id);
        setPost(post);

        function getPost(id) {
            let returnPost = null;
            posts.forEach(post => {
                if (post._id.toString() === id) {
                    returnPost = post;
                }
            });
            return returnPost;
        }
    }, [id]);

    return(post &&
        <PageLayout>
            <Post
                post={post}
                setLikes={setLikes}
                setLikesSectionIsActive={setLikesSectionIsActive}
            />
            <CommentsSection post={post}/>
            <LikesSection
                likes={likes}
                likesSectionIsActive={likesSectionIsActive}
                setLikesSectionIsActive={setLikesSectionIsActive}
            />
        </PageLayout>
    );
}

export default PostPage;

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
    )
}
