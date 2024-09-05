import { useEffect, useState } from "react";
import "./profileBottom.css";
import Loader from "../../../components/loader/Loader";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

import requests from "../../../serverRequests/requests";
const { putUserFollow } = requests.users;

function ProfileBottom() {
    const {
        profileUser,
        setFollowSectionIds,
        setIsFollowers, 
        setFollowSectionIsActive
    } = useProfile();
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

    return(profileUser &&
        <section className="profileBottom">
            <h2>{profileUser.username}</h2>
            { profileUser._id && (user._id !== profileUser._id) && <FollowButton/> }
            <div className="followCount">
                <p onClick={displayFollowers}>{profileUser.profile.followers.length} <span>followers</span></p>
                <div>&#x2022;</div>
                <p onClick={displayFollowing}>{profileUser.profile.following.length} <span>following</span></p>
            </div>
            <p>{profileUser.profile.bio}</p>
        </section>
    );
}

export default ProfileBottom;

function FollowButton() {
    const { profileUser, setProfileUser } = useProfile()
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
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
        } else {
            setResponsePopupData({ message: res.message, success: res.success });
            setResponsePopupIsActive(true);
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
