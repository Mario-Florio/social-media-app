import { useEffect, useState } from "react";
import "./profile.css";
import "./accountCreatedAtBanner.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import { ProfileProvider } from "./hooks/useProfile";
import ProfileTop from "./profileTop/ProfileTop";
import ProfileBottom from "./profileBottom/ProfileBottom";
import { PostsProvider } from "../../hooks/usePosts";
import PostsFeed from "../../components/postsFeed/PostsFeed";
import Photos from "./photos/Photos";
import FollowSection from "./followSection/FollowSection";
import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("posts");

    useEffect(() => {
        return () => {
            setProfileUser(null);
            setSelectedTab("posts");
        }
    }, [id]);

    const reqSpecs = {
        method: "getPosts",
        reqBody: {
            queryBody: {
                userId: id
            }
        }
    }

    return(
        <PageLayout>
            <ProfileProvider id={id} profileUser={profileUser} setProfileUser={setProfileUser}>
                <section id="profile" className="main-component">
                    <ProfileTop/>
                    <ProfileBottom/>
                    { profileUser && <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}/> }
                    { profileUser && selectedTab === "posts" ? 
                        <PostsProvider reqSpecs={reqSpecs}>
                            <PostsFeed forumId={profileUser && profileUser.profile.forum}>
                                    <article className="account-created-at_banner">
                                        <h3>{ new Date(profileUser.createdAt).toLocaleDateString() }</h3>
                                        <p>{ `${profileUser.username} created there account!` }</p>
                                    </article>
                            </PostsFeed>
                        </PostsProvider> :
                        profileUser && selectedTab === "photos" &&
                            <Photos/> }
                    <FollowSection/>
                </section>
            </ProfileProvider>
        </PageLayout>
    );
}

export default Profile;

function Tabs({ selectedTab, setSelectedTab }) {
    return(
        <section className="tabs">
            <div
                className={ selectedTab === "posts" ? "isActive container" : "container" }
                onClick={() => setSelectedTab("posts")}>
                <span>Posts</span>
            </div>
            <div
                className={ selectedTab === "photos" ? "isActive container" : "container" }
                onClick={() => setSelectedTab("photos")}>
                <span>Photos</span>
            </div>
            <div className="spacer"/>
        </section>
    );
}