import { useEffect, useState } from "react";
import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import { Post, LikesSection } from "../../components/timeline/post/Post";
import { useParams } from "react-router-dom";

import { getPost } from "../../dummyData";

function PostPage() {
    const [post, setPost] = useState({ _id: false, user: { profile: {} }, text: "", likes: [], comments: [] });
    const [likes, setLikes] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const post = getPost(id);
        setPost(post);
    }, [id]);

    return(
        <PageLayout>
            <section id="post" className="main-component">
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
            </section>
        </PageLayout>
    );
}

export default PostPage;