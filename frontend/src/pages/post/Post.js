import { useEffect, useState } from "react";
import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
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

    return(
        <PageLayout>
            { post &&
                <>
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
                </>
            }
        </PageLayout>
    );
}

export default PostPage;