import { useEffect, useState } from "react";
import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import { Post } from "../../components/timeline/post/Post";
import { useParams } from "react-router-dom";

import requests from "../../serverRequests/methods/config";
const { getPost } = requests.posts;

function PostPage() {
    const [post, setPost] = useState({ _id: false, user: { profile: {} }, text: "", likes: [], comments: [] });
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
                    setParentState={setParentState}
                />
                <CommentsSection post={post}/>
            </section>
        </PageLayout>
    );
}

export default PostPage;