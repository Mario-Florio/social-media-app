import { useEffect, useState } from "react";
import "./profile.css";
import "./accountCreatedAtBanner.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import ProfileTop from "./profileTop/ProfileTop";
import Timeline from "../../components/timeline/Timeline";
import { TimelineProvider } from "../../hooks/useTimeline";
import FollowSection from "./followSection/FollowSection";
import Loader from "../../components/loader/Loader";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import requests from "../../serverRequests/methods/config";

const { getUser, putUserFollow } = requests.users;

const placeholderProfileUser = { username: "Unable to load profile", createdAt: new Date(), profile: { picture: "", coverPicture: "", forum: { posts: [] }, following: [], followers: [] } };

function Profile() {
    const [profileUser, setProfileUser] = useState(null);
    const { id } = useParams();

    const [followSectionIds, setFollowSectionIds] = useState([]);
    const [followSectionIsActive, setFollowSectionIsActive] = useState(false);
    const [isFollowers, setIsFollowers] = useState(true);

    const reqSpecs = {
        method: "getPosts",
        reqBody: {
            queryBody: {
                userId: id
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const getUserRes = await getUser({ id });
                if (getUserRes.success) {
                    setProfileUser(getUserRes.user);
                    setFollowSectionIds(getUserRes.user.profile.followers);
                } else {
                    setProfileUser(placeholderProfileUser);
                }
            } catch (err) {
                console.log(err);
            }
        })();
        return () => {
            setProfileUser(null);
            setFollowSectionIds(null);
            setFollowSectionIsActive(false);
        }
    }, [id]);

    return(
        <PageLayout>
            <section id="profile" className="main-component">
                <ProfileTop profileUser={profileUser}/>
                { profileUser && <ProfileBottom
                    profileUser={profileUser}
                    setProfileUser={setProfileUser}
                    setFollowSectionIds={setFollowSectionIds}
                    setIsFollowers={setIsFollowers}
                    setFollowSectionIsActive={setFollowSectionIsActive}
                /> }
                { profileUser && <TimelineProvider reqSpecs={reqSpecs}>
                    <Timeline forumId={profileUser.profile.forum}>
                        <article className="account-created-at_banner">
                            <h3>{ new Date(profileUser.createdAt).toLocaleDateString() }</h3>
                            <p>{ `${profileUser.username} created there account!` }</p>
                        </article>
                    </Timeline>
                </TimelineProvider> }
                { followSectionIsActive && <FollowSection
                    followSectionIds={followSectionIds}
                    isFollowers={isFollowers}
                    followSectionIsActive={followSectionIsActive}
                    setFollowSectionIsActive={setFollowSectionIsActive}
                /> }
            </section>
        </PageLayout>
    );
}

export default Profile;

function ProfileBottom({
    profileUser,
    setProfileUser,
    setFollowSectionIds,
    setIsFollowers, 
    setFollowSectionIsActive
}) {
    const { user } = useAuth();

    function displayFollowers() {
        setFollowSectionIds(profileUser.profile.followers);
        setIsFollowers(true);
        setFollowSectionIsActive(true);
    }

    function displayFollowing() {
        setFollowSectionIds(profileUser.profile.following);
        setIsFollowers(false);
        setFollowSectionIsActive(true);
    }

    return(
        <section className="profileBottom">
            <h2>{profileUser.username}</h2>
            { profileUser._id && user._id !== profileUser._id &&
                <FollowButton
                    profileUser={profileUser}
                    setProfileUser={setProfileUser}
                /> }
                <div className="followCount">
                    <p onClick={displayFollowers}>{profileUser.profile.followers.length} <span>followers</span></p>
                    <div>&#x2022;</div>
                    <p onClick={displayFollowing}>{profileUser.profile.following.length} <span>following</span></p>
                </div>
                <p>{profileUser.profile.bio}</p>
        </section>
    )
}

function FollowButton({ profileUser, setProfileUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { user, updateUser, token } = useAuth();

    useEffect(() => {
        if (user.profile.following.includes(profileUser._id)) {
            setIsFollowing(true);
        }
    }, [user]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const res = await putUserFollow({
            userId: user._id,
            profileUserId: profileUser._id,
            follow: e.target.children[1].name === "follow" ? true : false,
            token
        });

        if (res.success) {
            setProfileUser(res.peerUser);
            setIsFollowing(!isFollowing);
            updateUser(res.clientUser);
        }
        
        setIsLoading(false);
    }

    return(isFollowing ? 
        <form onSubmit={handleSubmit}>
            <label htmlFor="unfollow" className="hide">Unfollow</label>
            <input type="checkbox" name="unfollow" id="unfollow" checked={true} readOnly className="hide"/>
            <button disabled={isLoading}>{ isLoading ?
                        <Loader color="var(--secondary-color)" secondaryColor="white" size={17}/> :
                        "Unfollow" }</button>
        </form> :
        <form onSubmit={handleSubmit}>
            <label htmlFor="follow" className="hide">Follow</label>
            <input type="checkbox" name="follow" id="follow" checked={true} readOnly className="hide"/>
            <button disabled={isLoading}>{ isLoading ?
                        <Loader color="var(--secondary-color)" secondaryColor="white" size={17}/> :
                        "Follow" }</button>
        </form>
    );
}
