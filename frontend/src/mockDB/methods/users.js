import getUsers from "../databases/Users";
import getPosts from "../databases/Posts";
import getForums from "../databases/Forums";

// Sidemenu
function getFollowingData(user) {
    const users = getUsers();

    let followingData = [];
    user.profile.following.forEach(a => {
        users.forEach(b => {
            if (a === b._id) {
                followingData.push(b);
            }
        });
    });

    return followingData;
}

// Topbar
function searchUsers(input) {
    const users = getUsers();

    const results = [];
    users.forEach(user => {
        if (user.username.toLowerCase().includes(input.toLowerCase())) {
            results.push(user);
        }
    });
    
    return results;
}

// Post
function getLikes(post) {
    const users = getUsers();

    let likes = [];
    post.likes.forEach(like => {
        users.forEach(user => {
            if (user._id === like) {
                likes.push(user);
            }
        });
    });

    return likes;
}

// Profile
function getProfileUser(id) {
    const users = getUsers();
    const posts = getPosts();
    const forums = getForums();

    let profileUser = null;
    users.forEach(user => {
        if (user.profile._id.toString() === id) {
            profileUser = user;
        }
    });

    getForum(profileUser);

    return profileUser;

    function getForum(user) {
        let forumData = null;
        forums.forEach(forum => {
            if (forum._id === user.profile.forum) {
                forumData = forum;
            }
        });
        user.profile.forum = forumData;
        populatePosts(user);

        function populatePosts(user) {
            const postsData = [];
            user.profile.forum.posts.forEach(userPost => {
                posts.forEach(post => {
                    if (post._id === userPost) {
                        postsData.push(post);
                    }
                });
            });
            user.profile.forum.posts = postsData;
        }
    }
}

export {
    getFollowingData,
    searchUsers,
    getLikes,
    getProfileUser
}