import { useEffect, useState } from "react";
import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTimeline } from "../../hooks/useTimeline";

import { populateProfileUser } from "../../serverRequests/methods/users";
import { populateForum } from "../../serverRequests/methods/forums";

import requests from "../../serverRequests/methods/config";

const { putUserFollow } = requests.users;

const placeholderProfileUser = { profile: { picture: "", coverPicture: "", forum: { posts: [] }, following: [], followers: [] } };

function Profile() {
    const [profileUser, setProfileUser] = useState(placeholderProfileUser);
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();
    const { setPostIds } = useTimeline();
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const profileUser = await populateProfileUser(id);

                if (user.profile.following.includes(profileUser._id)) {
                    setIsFollowing(true);
                }

                const populatedForum = await populateForum(profileUser.profile.forum);
                profileUser.profile.forum = populatedForum;
                setProfileUser(profileUser);
                setPostIds(profileUser.profile.forum.posts);
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            setProfileUser(placeholderProfileUser);
            setPostIds([]);
        }
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
                            <FollowButton
                                profileUser={profileUser}
                                setProfileUser={setProfileUser}
                                isFollowing={isFollowing}
                                setIsFollowing={setIsFollowing}
                            />}
                            <div className="followCount">
                                <p>{profileUser.profile.followers.length} <span>followers</span></p>
                                <div>&#x2022;</div>
                                <p>{profileUser.profile.following.length} <span>following</span></p>
                            </div>
                            <p>{profileUser.profile.bio}</p>
                    </section>
                    <Timeline forumId={profileUser.profile.forum._id}/>
                </section>
        </PageLayout>
    );
}

export default Profile;

function FollowButton({ profileUser, setProfileUser, isFollowing, setIsFollowing }) {
    const { user, updateUser } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await putUserFollow({
            userId: user._id,
            profileUserId: profileUser._id,
            follow: e.target.children[1].name === "follow" ? true : false
        });

        if (res.success) {
            setProfileUser(res.profileUser);
            setIsFollowing(!isFollowing);
            await updateUser();
        }
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
