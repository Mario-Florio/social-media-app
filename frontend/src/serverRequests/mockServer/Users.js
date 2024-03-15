import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 1000;

async function getUsersMock(reqBody) {
    await delay(ms);

    const users = getCollection("Users");

    return { message: "Request successful", users, success: true };
}

async function getUserMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const users = getCollection("Users");

    let userFound = null;
    for (const user of users) {
        if (user._id === id) {
            userFound = user;
        }
    }

    if (!userFound) {
        return { message: "Request failed: User not found", success: false };
    }

    return { message: "Request successful", user: userFound, success: true };
}

async function postUserMock(reqBody) {
    await delay(ms);

    const { username, password } = reqBody.credentials;

    const users = getCollection("Users", { showHidden: "password" });
    const forums = getCollection("Forums");

    for (const user of users) {
        if (user.username === username) {
            return { message: "User already exists", success: true };
        }
    }

    const _id = uid();
    const newForum = { _id, posts: [] };
    const newUser = {
        _id,
        username,
        password,
        profile: {
            _id,
            picture: "../../assets/imgs/default/profile-picture.jpg",
            coverPicture: "../../assets/imgs/default/cover-photo.jpg",
            bio: "Hello world!",
            followers: [],
            following: [],
            forum: _id
        }
    }

    users.push(newUser);
    window.localStorage.setItem("Users", JSON.stringify(users));
    forums.push(newForum);
    window.localStorage.setItem("Forums", JSON.stringify(forums));

    delete newUser.password;

    return { message: "Success: user has been created", user: newUser, success: true };
}

async function putUserMock(reqBody) {
    await delay(ms);

    const { id, update, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users", { showHidden: "password" });

    let userFound = false;
    let index = 0;
    for (const user of users) {
        if (user._id === id) {
            userFound = true;
            break;
        }
        index++;
    }

    if (!userFound) return { message: "User does not exist", success: false };

    for (const key in update) {
        if (key !== "profile" ||
            key !== "_id" ||
            key !== "createdAt") {
            users[index][key] = update[key];
        }
    }

    window.localStorage.setItem("Users", JSON.stringify(users));

    delete users[index].password;

    return { message: "Update was successful", user: users[index], success: true };
}

async function deleteUserMock(reqBody) {
    await delay(ms);

    const { id, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users", { showHidden: "password" });
    const forums = getCollection("Forums");
    const posts = getCollection("Posts");
    const comments = getCollection("Comments");

    const [ user ] = users.filter(user => user._id === id);

    if (!user) return { message: "User does not exist", success: false };

    const filteredUsers = users.filter(user => user._id !== id);

    for (let i = 0; i < filteredUsers.length; i++) {
        const filteredFollowing = filteredUsers[i].profile.following.filter(userId => userId !== user._id);
        const filteredFollowers = filteredUsers[i].profile.followers.filter(userId => userId !== user._id);
        filteredUsers[i].profile.following = filteredFollowing;
        filteredUsers[i].profile.followers = filteredFollowers;

    }

    const filteredForums = forums.filter(forum => forum._id !== user.profile.forum);

    for (let i = 0; i < filteredForums.length; i++) {
        const filteredPosts = filteredForums[i].posts.filter(postId => {
            let isUser = false;
            for (let i = 0; i < posts.length; i++) {
                if (posts[i]._id === postId) {
                    isUser = posts[i].user === user._id;
                    break;
                }
            }
            return !isUser;
        });
        filteredForums[i].posts = filteredPosts;
    }

    const filteredPosts = posts.filter(post => post.user !== user._id);

    for (let i = 0; i < filteredPosts.length; i++) {
        const filteredLikes = filteredPosts[i].likes.filter(userId => userId !== user._id);
        const filteredComments = filteredPosts[i].comments.filter(commentId => {
            let isUser = false;
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]._id === commentId) {
                    isUser = comments[i].user === user._id;
                    break;
                }
            }
            return !isUser;
        });
        filteredPosts[i].likes = filteredLikes;
        filteredPosts[i].comments = filteredComments;
    }

    const filteredComments = comments.filter(comment => comment.user !== user._id);

    window.localStorage.setItem("Users", JSON.stringify(filteredUsers));
    window.localStorage.setItem("Forums", JSON.stringify(filteredForums));
    window.localStorage.setItem("Posts", JSON.stringify(filteredPosts));
    window.localStorage.setItem("Comments", JSON.stringify(filteredComments));

    return { message: "Deletion was successful", success: true };
}

async function putProfileMock(reqBody) {
    await delay(ms);

    const { id, update, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users", { showHidden: "password" });

    let userFound = false;
    let index = 0;
    for (const user of users) {
        if (user._id === id) {
            userFound = true;
            break;
        }
        index++;
    }

    if (!userFound) return { message: "User does not exist", success: false };

    for (const key in update) {
        if (key !== "forum" ||
            key !== "following" ||
            key !== "followers" ||
            key !== "_id" ||
            key !== "createdAt") {
            users[index].profile[key] = update[key];
        }
    }

    window.localStorage.setItem("Users", JSON.stringify(users));

    delete users[index].password;

    return { message: "Update was successful", user: users[index], success: true };
}

async function putUserFollowMock(reqBody) {
    await delay(ms);

    const { userId, profileUserId, follow, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users", { showHidden: "password" });

    let profileUserFound = false;
    let profileUserIndex = null;
    let userFound = false;
    let userIndex = null;
    let index = 0;
    for (const user of users) {
        if (user._id === profileUserId) {
            profileUserFound = true;
            profileUserIndex = index;
        }
        if (user._id === userId) {
            userFound = true;
            userIndex = index;
        }
        index++;
    }

    if (!userFound || !profileUserFound) return { message: "User does not exist", success: false };

    if (follow) {
        if (!users[userIndex].profile.following.includes(profileUserId) &&
            !users[profileUserIndex].profile.followers.includes(userId)) {
                users[userIndex].profile.following.push(profileUserId);
                users[profileUserIndex].profile.followers.push(userId);
        } else {
            return { message: "Already following user", success: false };
        }
    }

    if (!follow) {
        if (users[userIndex].profile.following.includes(profileUserId) &&
            users[profileUserIndex].profile.followers.includes(userId)) {
                users[userIndex].profile.following.splice(users[userIndex].profile.following.indexOf(profileUserId), 1);
                users[profileUserIndex].profile.followers.splice(users[profileUserIndex].profile.followers.indexOf(userId), 1);
        } else {
            return { message: "Already not following user", success: false };
        }
    }

    window.localStorage.setItem("Users", JSON.stringify(users));

    delete users[profileUserIndex].password;
    delete users[userIndex].password;

    return {
        message: "Update was successful",
        success: true,
        peerUser: users[profileUserIndex],
        clientUser: users[userIndex]
    };
}

export {
    getUsersMock,
    getUserMock,
    postUserMock,
    putUserMock,
    deleteUserMock,
    putProfileMock,
    putUserFollowMock
};