import { useEffect, useState } from "react";
import "./home.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useAuth } from "../../hooks/useAuth";

import { populateForum } from "../../serverRequests/methods/forums";
import { populateUsers } from "../../serverRequests/methods/users";
import { populatePosts } from "../../serverRequests/methods/posts";

function Home() {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const timelineIds = await getTimelineIds();
                await setPlaceholders(timelineIds);
                await setTimeline(timelineIds);

                async function getTimelineIds() {
                    const timelineIds = [];
                    const userForum = await populateForum(user.profile.forum);
                    timelineIds.push(...userForum.posts);

                    const following = await populateUsers(user.profile.following);
                    await Promise.all(following.map(async user => {
                        const forum = await populateForum(user.profile.forum);
                        timelineIds.push(...forum.posts);
                    }));

                    return timelineIds;
                }

                async function setPlaceholders(timelineIds) {
                    const placeholderPosts = [];
                    timelineIds.forEach(id => {
                        placeholderPosts.push({
                            _id: id,
                            user: { profile: {} },
                            text: "",
                            likes: [],
                            comments: []
                        });
                    });
                    setPosts(placeholderPosts);
                }

                async function setTimeline(timelineIds) {
                    const timeline = await populatePosts(timelineIds);
                    setPosts(timeline);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [user]);

    return(
        <PageLayout>
            <section id="home" className="main-component">
                <Timeline posts={posts}/> 
            </section>
        </PageLayout>
    );
}

export default Home;