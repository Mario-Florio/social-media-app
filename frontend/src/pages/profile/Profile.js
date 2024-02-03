import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

import getData from "../../dummyData";

function Profile() {
    const [profileUser, setProfileUser] = useState(null);
    const { id } = useParams();
    // const { user } = useAuth();

    useEffect(() => {
        const profileUser = getProfileUser(id);
        setProfileUser(profileUser);

        function getProfileUser(id) {
            const { users, posts } = getData();
            let profileUser = null;

            users.forEach(user => {
                if (user.profile._id.toString() === id) {
                    profileUser = user;
                }
            });

            populatePosts(profileUser);

            return profileUser;

            // UTILS
            function populatePosts(user) {
                const postsData = [];

                user.profile.posts.forEach(userPost => {
                    posts.forEach(post => {
                        if (post._id === userPost) {
                            postsData.push(post);
                        }
                    });
                });

                user.profile.posts = postsData;
            }
        }
    }, [id]);

    return(profileUser &&
        <PageLayout>
            <section className="profileTop">
                <img src={profileUser.profile.coverPhoto} alt="cover" className="coverPhoto"/>
                <img src={profileUser.profile.pic} alt="profile" className="profilePic"/>
            </section>
            <Timeline posts={profileUser.profile.posts}/>
        </PageLayout>
    );
}

export default Profile;