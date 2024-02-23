import { useEffect, useState } from "react";
import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import { Post, LikesSection } from "../../components/timeline/post/Post";
import { useParams } from "react-router-dom";

import requests from "../../serverRequests/methods/config";
const { getPost } = requests.posts;

function PostPage() {
    const [post, setPost] = useState({ _id: false, user: { profile: {} }, text: "", likes: [], comments: [] });
    const [likeIds, setLikeIds] = useState([]);
    const [likesSectionIsActive, setLikesSectionIsActive] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                await setParentState();
            } catch (err) {
                console.log(err);
            }
        })();
    }, [id]);

    async function setParentState() {
        const post = await getPost(id);
        setPost(post);
    };

    return(
        <PageLayout>
            <section id="post" className="main-component">
                <Post
                    post={post}
                    setLikeIds={setLikeIds}
                    setLikesSectionIsActive={setLikesSectionIsActive}
                    setParentState={setParentState}
                />
                <CommentsSection post={post}/>
                <LikesSection
                    likeIds={likeIds}
                    likesSectionIsActive={likesSectionIsActive}
                    setLikesSectionIsActive={setLikesSectionIsActive}
                />
            </section>
        </PageLayout>
    );
}

export default PostPage;