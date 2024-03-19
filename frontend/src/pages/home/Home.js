import "./home.css";
import "./noActivity.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { TimelineProvider } from "../../hooks/useTimeline";
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
                <TimelineProvider reqSpecs={reqSpecs}>
                    <Timeline forumId={user.profile.forum}>
                        <article className="no-activity">
                            <h3>Looks like there is no activity</h3>
                            <p>Try searching for some friends to follow!</p>
                        </article>
                    </Timeline>
                </TimelineProvider>
            </section>
        </PageLayout>
    );
}

export default Home;