import { useEffect } from "react";
import "./home.css";
import "./noActivity.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import requests from "../../serverRequests/methods/config";
import { populateUsers } from "../../serverRequests/methods/users";

const { getPosts } = requests.posts;
const { getForum } = requests.forums;

function Home() {
    const { setPostIds, setPosts } = useTimeline();
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const postIds = await getPostIds();
                setPostIds(postIds);
                // const queryBody = {
                //     users: [...user.profile.following, user._id]
                // };
                // const res = await getPosts({ queryBody });
                // if (res.success) {
                //     setPosts(res.posts);
                // }
                // setPostIds([]);
            } catch (err) {
                console.log(err);
            }
        })();

        async function getPostIds() {
            const postIds = [];
            const res = await getForum({ id: user.profile.forum });
            if (res.success) {
                postIds.push(...res.forum.posts.reverse());
            }
    
            const following = await populateUsers(user.profile.following);
            await Promise.all(following.map(async user => {
                const res = await getForum({ id: user.profile.forum });
                if (res.success) {
                    postIds.push(...res.forum.posts.reverse());
                }
            }));
    
            return postIds;
        }
    }, [user]);

    return(
        <PageLayout>
            <section id="home" className="main-component">
                <Timeline forumId={user.profile.forum}>
                    <article className="no-activity">
                        <h3>Looks like there is no activity</h3>
                        <p>Try searching for some friends to follow!</p>
                    </article>
                </Timeline>
            </section>
        </PageLayout>
    );
}

export default Home;