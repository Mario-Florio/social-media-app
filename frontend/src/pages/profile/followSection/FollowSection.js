import { useEffect, useState } from "react";
import "./followSection.css";
import SectionWrapper from "../../../components/sectionWrapper/SectionWrapper";

import { populateUsers } from "../../../serverRequests/methods/users";
import { Link } from "react-router-dom";

function FollowSection({ followSectionIds, isFollowers, followSectionIsActive, setFollowSectionIsActive }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const users = await populateUsers(followSectionIds);
                setUsers(users);
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false);
        })();
    }, [followSectionIds, followSectionIsActive]);

    return(
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
                        </li>
                    )
                        :
                    users.map(user =>
                        <li key={user._id}>
                            <Link
                                to={`/users/${user._id}`}
                                onClick={() => setFollowSectionIsActive(false)}
                            >
                                <div className="profile_wrapper">
                                    <div className="profile-pic_wrapper">
                                        <img src={user.profile.picture} alt="users profile pic"/>
                                    </div>
                                    <h4>{user.username}</h4>
                                </div>
                            </Link>
                        </li>
                    ) }
            </ul>
        </SectionWrapper>
    );
}

export default FollowSection;