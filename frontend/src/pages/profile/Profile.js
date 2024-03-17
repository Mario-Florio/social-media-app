import { useEffect, useState } from "react";
import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import ProfileTop from "./profileTop/ProfileTop";
import Timeline from "../../components/timeline/Timeline";
import Loader from "../../components/loader/Loader";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import { populateProfileUser } from "../../serverRequests/methods/users";

import requests from "../../serverRequests/methods/config";
import FollowSection from "./followSection/FollowSection";

const { getForum } = requests.forums;
const { putUserFollow } = requests.users;

const placeholderProfileUser = { username: "", createdAt: new Date(), profile: { picture: "", coverPicture: "", forum: { posts: [] }, following: [], followers: [] } };

function Profile() {
    const [profileUser, setProfileUser] = useState(placeholderProfileUser);
    const [isLoading, setIsLoading] = useState(false);
    const [userIds, setUserIds] = useState(profileUser.profile.followers)
    const [followSectionIsActive, setFollowSectionIsActive] = useState(false);
    const [isFollowers, setIsFollowers] = useState(true);
    const { id } = useParams();
    const { setPostIds } = useTimeline();

    useEffect(() => {
        setIsLoading(true);
        setUserIds(profileUser.profile.followers);
        setFollowSectionIsActive(false);
        setIsFollowers(true);
        (async () => {
            try {
                const profileUser = await populateProfileUser(id);

                const res = await getForum({ id: profileUser.profile.forum });
                if (res.success) {
                    profileUser.profile.forum = res.forum;
                    setProfileUser(profileUser);
                    setPostIds(profileUser.profile.forum.posts.reverse());
                }
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            setProfileUser(placeholderProfileUser);
            setPostIds([]);
            setIsLoading(false);
        }
    }, [id, setPostIds]);

    return(
        <PageLayout>
            <section id="profile" className="main-component">
                <ProfileTop profileUser={profileUser} isLoading={isLoading}/>
                <ProfileBottom
                    profileUser={profileUser}
                    setProfileUser={setProfileUser}
                    setUserIds={setUserIds}
                    setIsFollowers={setIsFollowers}
                    setFollowSectionIsActive={setFollowSectionIsActive}
                />
                <Timeline forumId={profileUser.profile.forum._id} profileUser={profileUser}/>
                { followSectionIsActive && <FollowSection
                    userIds={userIds}
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
    isLoading,
    profileUser,
    setProfileUser,
    setUserIds,
    setIsFollowers, 
    setFollowSectionIsActive
}) {
    const { user } = useAuth();

    function displayFollowers() {
        setUserIds(profileUser.profile.followers);
        setIsFollowers(true);
        setFollowSectionIsActive(true);
    }

    function displayFollowing() {
        setUserIds(profileUser.profile.following);
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
