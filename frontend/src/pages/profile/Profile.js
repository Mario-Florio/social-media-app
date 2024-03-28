import { useEffect, useState } from "react";
import "./profile.css";
import "./accountCreatedAtBanner.css";
import { Link } from "react-router-dom";
import PageLayout from "../../components/pageLayout/PageLayout";
import { ProfileProvider } from "./hooks/useProfile";
import ProfileTop from "./profileTop/ProfileTop";
import ProfileBottom from "./profileBottom/ProfileBottom";
import { PostsProvider } from "../../hooks/usePosts";
import PostsFeed from "../../components/postsFeed/PostsFeed";
import FollowSection from "./followSection/FollowSection";
import { useParams } from "react-router-dom";

// photos
import "./photos.css";
import profilePhoto from "../../assets/imgs/janeDough/profile-pic.jpg";
import coverPhoto from "../../assets/imgs/janeDough/cover-photo.jpg";
import photo1 from "../../assets/imgs/ellieWilliams/profile-pic.jpg";
import photo2 from "../../assets/imgs/ellieWilliams/cover-photo.jpg";

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

function Photos() {
    return(
        <section className="photos">
            <h3>Albums</h3>
            <ul>
                <li>
                    <Link>
                        <div className="album-preview">
                            <div className="img_wrapper photo-3">
                                <img src={photo2}/>
                            </div>
                            <div className="img_wrapper photo-2">
                                <img src={photo1}/>
                            </div>
                            <div className="img_wrapper photo-1">
                                <img src={profilePhoto}/>
                            </div>
                        </div>
                        <h4>Profile Pictures</h4>
                    </Link>
                </li>
                <li>
                    <Link>
                        <div className="album-preview">
                            <div className="img_wrapper photo-3">
                                <img src={photo2}/>
                            </div>
                            <div className="img_wrapper photo-2">
                                <img src={photo1}/>
                            </div>
                            <div className="img_wrapper photo-1">
                                <img src={coverPhoto}/>
                            </div>
                        </div>
                        <h4>Cover Photos</h4>
                    </Link>
                </li>
            </ul>
        </section>
    );
}

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