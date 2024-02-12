import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

import { getProfileUser } from "../../mockDB/methods/users";

const placeholderProfileUser = { profile: { picture: "", coverPicture: "", forum: { posts: [] }, following: [], followers: [] } };

function Profile() {
    const [profileUser, setProfileUser] = useState(placeholderProfileUser);
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        setProfileUser(placeholderProfileUser);
        setTimeout(() => {
            const profileUser = getProfileUser(id);
            setProfileUser(profileUser);

            profileUser.profile.followers.forEach(follower => {
                if (follower === user._id) {
                    setIsFollowing(true);
                }
            });
        }, 3000);
    }, [id, user]);

    return(
        <PageLayout>
                <section id="profile" className="main-component">
                    <section className="profileTop">
                        { profileUser.profile.coverPicture ? 
                            <img src={profileUser.profile.coverPicture} alt="cover" className="coverPhoto"/> :
                            <div className="loadingBGColor coverPhoto"></div> }
                        { profileUser.profile.picture ?
                            <img src={profileUser.profile.picture} alt="profile" className="profilePic"/> :
                            <div className="loadingBGColor profilePic"></div> }
                    </section>
                    <section className="profileBottom">
                        <h2>{profileUser.username}</h2>
                        {user._id !== profileUser._id && profileUser._id &&
                            <FollowButton isFollowing={isFollowing} setIsFollowing={setIsFollowing}/>}
                            <div className="followCount">
                                <p>{profileUser.profile.followers.length} <span>followers</span></p>
                                <div>&#x2022;</div>
                                <p>{profileUser.profile.following.length} <span>following</span></p>
                            </div>
                            <p>{profileUser.profile.bio}</p>
                    </section>
                    <Timeline posts={profileUser.profile.forum.posts}/>
                </section>
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
