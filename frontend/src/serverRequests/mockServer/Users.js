import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 2000;

async function getUsersMock(reqBody = { queryBody: {} }) {
    await delay(ms);

    const { queryBody } = reqBody;

    const limit = queryBody.limit || 10;
    const page = queryBody.page || 0;

    let users = getCollection("Users");

    if (queryBody.populate) {
        const userIds = [];
        if (queryBody.populate.model === "User") {
            for (const field of queryBody.populate.fields) {
                const [ user ] = users.filter(user => user._id === queryBody.populate._id);
                Array.isArray(user.profile[field]) && userIds.push(...user.profile[field]);
            }
        }
        if (queryBody.populate.model === "Post") {
            const posts = getCollection("Posts");
            for (const field of queryBody.populate.fields) {
                const [ post ] = posts.filter(post => post._id === queryBody.populate._id);
                Array.isArray(post[field]) && userIds.push(...post[field]);
            }
        }
        users = users.filter(user => {
            for (let i = 0; i < userIds.length; i++) {
                if (userIds[i] === user._id) {
                    return true
                }
            }
            return false;
        });
    }

    if (queryBody.search) {
        users = users.filter(user => user.username.toLowerCase().includes(queryBody.search.toLowerCase()));
    }

    users = users.filter((user, i) => (i+1 > page * limit) && (i+1 <= page * limit + limit));

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
            return { message: "User already exists", success: false };
        }
    }

    const _id = uid();
    const newForum = { _id, posts: [] };
    const newUser = {
        _id,
        username,
        password,
        createdAt: new Date(),
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

    for (let i = 0; i < posts.length; i++) {
        // 1. delete all refs to users comments in posts (i.e. post.comments)
        const filteredComments = posts[i].comments.filter(commentId => {
            let isUser = false;
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]._id === commentId) {
                    isUser = comments[i].user === user._id;
                    break;
                }
            }
            return !isUser;
        });

        // 2. delete all refs to user in posts (i.e. post.likes)
        const filteredLikes = posts[i].likes.filter(userId => userId !== user._id);
        
        posts[i].likes = filteredLikes;
        posts[i].comments = filteredComments;
    }

    // 3. delete all comments made by user (i.e. comment.user)
    let filteredComments = comments.filter(comment => comment.user !== user._id);

    // 4. delete all posts from Posts ref'd in users forum
    const [ userForum ] = forums.filter(forum => forum._id === user.profile.forum);
    const commentIdsFromDeletedPosts = []; // used in next step
    let filteredPosts = posts.filter(post => {
        console.log(post._id);
        console.log(userForum.posts.includes(post._id))
        if (userForum.posts.includes(post._id)) {
            commentIdsFromDeletedPosts.push(...post.comments);
        }
        return !userForum.posts.includes(post._id)
    });

    // 5. delete all refs to user in forums (i.e. forums.posts)
    for (let i = 0; i < forums.length; i++) {
        const filteredPosts = forums[i].posts.filter(postId => {
            let isUser = false;
            for (let i = 0; i < posts.length; i++) {
                if (posts[i]._id === postId) {
                    isUser = posts[i].user === user._id;
                    break;
                }
            }
            return !isUser;
        });
        forums[i].posts = filteredPosts;
    }

    // 6. delete all comments that existed on users deleted posts (i.e. user.profile.forum.posts.forEach(comment))
    filteredComments = filteredComments.filter(comment => !commentIdsFromDeletedPosts.includes(comment._id));

    // 7. delete any posts made by user
    filteredPosts = filteredPosts.filter(post => post.user !== user._id);

    // 8. delete users forum
    const filteredForums = forums.filter(forum => forum._id !== user.profile.forum);

    // 9. delete all refs to user in Profiles (i.e. profile.following / profile.followers)
    for (let i = 0; i < users.length; i++) {
        const filteredFollowing = users[i].profile.following.filter(userId => userId !== user._id);
        const filteredFollowers = users[i].profile.followers.filter(userId => userId !== user._id);
        users[i].profile.following = filteredFollowing;
        users[i].profile.followers = filteredFollowers;
    }

    // 10. delete users profile
    // 11. delete user
    const filteredUsers = users.filter(user => user._id !== id);

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