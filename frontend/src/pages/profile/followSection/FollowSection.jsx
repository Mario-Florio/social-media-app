import { useEffect, useState } from "react";
import "./followSection.css";
import SectionWrapper from "../../../components/sectionWrapper/SectionWrapper";
import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { defaultProfilePic } from "../../../defaultImages/defaultImages";

import requests from "../../../serverRequests/methods/config";
import ImgHandler from "../../../components/imgHandler/ImgHandler";
import photoExists from "../../../components/imgHandler/__utils__/photoExists";
const { getUsers } = requests.users;

function FollowSection() {
    const {
        profileUser,
        followSectionIds,
        isFollowers,
        followSectionIsActive, setFollowSectionIsActive
    } = useProfile();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        profileUser && (async () => {
            try {
                const queryBody = {
                    populate: {
                        model: "User",
                        _id: profileUser._id,
                        fields: [isFollowers ? "followers" : "following"]
                    }
                }
                const res = await getUsers({ queryBody });

                if (res.success) {
                    setUsers(res.users);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [profileUser, isFollowers, followSectionIds, followSectionIsActive]);

    return(profileUser &&
        <SectionWrapper
            sectionClassName="follows-section"
            sectionIsActive={followSectionIsActive}
            setSectionIsActive={setFollowSectionIsActive}
        >
            <h3>{ isFollowers ? "Followers" : "Following" }</h3>
            <ul>
                { isLoading ?
                    followSectionIds.map(userId => 
                        <li key={userId}>
                            <div className="profile_wrapper">
                                <div className="loadingBGColor profile-pic_wrapper"></div>
                                <div className="loadingBGColor" style={{ height: "1rem", width: "40%", borderRadius: "5px" }}></div>
                            </div>
                        </li>)
                        :
                    users.map(user =>
                        <li key={user._id}>
                            <Link
                                to={`/users/${user._id}`}
                                onClick={() => setFollowSectionIsActive(false)}
                            >
                                <div className="profile_wrapper">
                                    <div className="profile-pic_wrapper">
                                        <ImgHandler src={photoExists(user.profile.picture)} type="profile"/>
                                    </div>
                                    <h4>{user.username}</h4>
                                </div>
                            </Link>
                        </li>) }
            </ul>
        </SectionWrapper>
    );
}

export default FollowSection;