import "./home.css";
import "./noActivity.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import PostsFeed from "../../components/postsFeed/PostsFeed";
import { PostsProvider } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";

function Home() {
    const { user } = useAuth();

    const reqSpecs = {
        method: "getPosts",
        reqBody: {
            queryBody: {
                userId: user._id,
                timeline: true
            }
        }
    };

    return(
        <PageLayout>
            <section id="home" className="main-component">
                <PostsProvider reqSpecs={reqSpecs}>
                    <PostsFeed forumId={user.profile.forum}>
                        <article className="no-activity">
                            <h3>Looks like there is no activity</h3>
                            <p>Try searching for some friends to follow!</p>
                        </article>
                    </PostsFeed>
                </PostsProvider>
            </section>
        </PageLayout>
    );
}

export default Home;