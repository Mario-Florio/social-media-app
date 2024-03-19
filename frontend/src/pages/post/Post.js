import "./post.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import CommentsSection from "./commentsSection/CommentsSection";
import Post from "../../components/post/Post";
import { TimelineProvider} from "../../hooks/useTimeline";
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
                <TimelineProvider reqSpecs={reqSpecs}>
                    <Post postId={id}/>
                    <CommentsSection postId={id}/>
                </TimelineProvider>
            </section>
        </PageLayout>
    );
}

export default PostPage;