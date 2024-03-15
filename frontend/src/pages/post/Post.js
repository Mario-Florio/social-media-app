import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import Post from "../../components/post/Post";
import { useParams } from "react-router-dom";

function PostPage() {
    const { id } = useParams();

    return(
        <PageLayout>
            <section id="post" className="main-component">
                <Post postId={id}/>
                <CommentsSection postId={id}/>
            </section>
        </PageLayout>
    );
}

export default PostPage;