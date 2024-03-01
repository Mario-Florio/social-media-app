import { useEffect } from "react";
import "./home.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import { populateForum } from "../../serverRequests/methods/forums";
import { populateUsers } from "../../serverRequests/methods/users";

function Home() {
    const { setPostIds } = useTimeline();
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const postIds = await getPostIds();
                setPostIds(postIds);
            } catch (err) {
                console.log(err);
            }
        })();

        async function getPostIds() {
            const postIds = [];
            const userForum = await populateForum(user.profile.forum);
            postIds.push(...userForum.posts.reverse());
    
            const following = await populateUsers(user.profile.following);
            await Promise.all(following.map(async user => {
                const forum = await populateForum(user.profile.forum);
                postIds.push(...forum.posts.reverse());
            }));
    
            return postIds;
        }
    }, [user]);

    return(
        <PageLayout>
            <section id="home" className="main-component">
                <Timeline forumId={user.profile.forum}/> 
            </section>
        </PageLayout>
    );
}

export default Home;