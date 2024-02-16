import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

import { populateProfileUser } from "../../serverRequests/methods/users";
import { populateForum } from "../../serverRequests/methods/forums";
import { populatePosts } from "../../serverRequests/methods/posts";

const placeholderProfileUser = { profile: { picture: "", coverPicture: "", forum: { posts: [] }, following: [], followers: [] } };

function Profile() {
    const [profileUser, setProfileUser] = useState(placeholderProfileUser);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        setProfileUser(placeholderProfileUser);
        setPosts([]);

        (async () => {
            try {
                const profileUser = await populateProfileUser(id);
                setProfileUser(profileUser);

                const populatedForum = await populateForum(profileUser.profile.forum);
                profileUser.profile.forum = populatedForum;
                const placeholderPosts = [];
                profileUser.profile.forum.posts.forEach(postId => {
                    const placeholderPost = {
                        _id: postId,
                        user: { profile: {} },
                        text: "",
                        likes: [],
                        comments: []
                    };
                    placeholderPosts.push(placeholderPost);
                });
                setProfileUser(profileUser);
                setPosts(placeholderPosts);
        
                const posts = await populatePosts(profileUser.profile.forum.posts);
                setPosts(posts);
            } catch (err) {
                console.log(err);
            }
        })();
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
                    <Timeline posts={posts}/>
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
