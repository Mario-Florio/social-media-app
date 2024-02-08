import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

import { getProfileUser } from "../../dummyData";

function Profile() {
    const [profileUser, setProfileUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const profileUser = getProfileUser(id);
        setProfileUser(profileUser);

        profileUser.profile.followers.forEach(follower => {
            if (follower === user._id) {
                setIsFollowing(true);
            }
        });
    }, [id, user]);

    return(
        <PageLayout>
            { profileUser &&
                <>
                    <section className="profileTop">
                        <img src={profileUser.profile.coverPhoto} alt="cover" className="coverPhoto"/>
                        <img src={profileUser.profile.pic} alt="profile" className="profilePic"/>
                    </section>
                    <section className="profileBottom">
                        {user._id !== profileUser._id &&
                            <FollowButton isFollowing={isFollowing} setIsFollowing={setIsFollowing}/>}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <p style={{ margin: "0" }}>{profileUser.profile.followers.length} <span>followers</span></p>
                                <div style={{ margin: "0 .5rem" }}>&#x2022;</div>
                                <p style={{ margin: "0" }}>{profileUser.profile.following.length} <span>following</span></p>
                            </div>
                            <p>{profileUser.profile.bio}</p>
                    </section>
                    <Timeline posts={profileUser.profile.posts}/>
                </>
            }
        </PageLayout>
    );
}

export default Profile;

function FollowButton({ isFollowing, setIsFollowing }) {

    function handleSubmit(e) {
        e.preventDefault();
        setIsFollowing(!isFollowing);
    }

    return(
        isFollowing ? 
            <form onSubmit={handleSubmit}>
                <label htmlFor="unfollow" className="hide">Unfollow</label>
                <input type="checkbox" name="unfollow" id="unfollow" checked={true} readOnly className="hide"/>
                <button>Unfollow</button>
            </form> :
            <form onSubmit={handleSubmit}>
                <label htmlFor="follow" className="hide">Follow</label>
                <input type="checkbox" name="follow" id="follow" checked={true} readOnly className="hide"/>
                <button>Follow</button>
            </form>
    );
}
