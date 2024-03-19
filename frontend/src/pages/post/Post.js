import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import Post from "../../components/post/Post";
import { PostsProvider} from "../../hooks/usePosts";
import { useParams } from "react-router-dom";

function PostPage() {
    const { id } = useParams();

    const reqSpecs = {
        method: "getPost",
        reqBody: {
            id
        }
    }

    return(
        <PageLayout>
            <section id="post" className="main-component">
                <PostsProvider reqSpecs={reqSpecs}>
                    <Post postId={id}/>
                    <CommentsSection postId={id}/>
                </PostsProvider>
            </section>
        </PageLayout>
    );
}

export default PostPage;