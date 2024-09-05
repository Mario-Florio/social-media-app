import { createContext, useContext, useEffect, useState } from "react";

import requests from "../../../serverRequests/requests";
const { getUser } = requests.users;

const ProfileContext = createContext();

const placeholderProfileUser = {
    username: "Unable to load profile",
    createdAt: new Date(),
    profile: {
        picture: "",
        coverPicture: "", 
        forum: { posts: [] },
        following: [],
        followers: []
    }
};

export const ProfileProvider = ({ id, profileUser, setProfileUser, children }) => {
    const [followSectionIds, setFollowSectionIds] = useState([]);
    const [followSectionIsActive, setFollowSectionIsActive] = useState(false);
    const [isFollowers, setIsFollowers] = useState(true);

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

    const value = {
        profileUser, setProfileUser,
        followSectionIds, setFollowSectionIds,
        followSectionIsActive, setFollowSectionIsActive,
        isFollowers, setIsFollowers
    }

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
    return useContext(ProfileContext);
};
