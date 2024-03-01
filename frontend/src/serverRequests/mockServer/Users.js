
const ms = 1000;

async function getUsersMock(reqBody) {
    await delay(ms);

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    return { message: "Request successful", users, success: true };
}

async function getUserMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

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

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);
    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    for (const user of users) {
        if (user.username === username) {
            throw new Error("404: User already exists");
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

    return { message: "Success: user has been created", success: true };
}

async function putUserMock(reqBody) {
    await delay(ms);

    const { id, update } = reqBody;

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== id) return { message: "Request is forbidden", success: false };

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

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

    users[index] = update;
    window.localStorage.setItem("Users", JSON.stringify(users));

    return { message: "Update was successful", user: update, success: true };
}

async function deleteUserMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== id) return { message: "Request is forbidden", success: false };

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

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

    users.splice(index, 1);
    window.localStorage.setItem(JSON.stringify(users));

    return { message: "Deletion was successful", success: true };
}

async function putUserFollowMock(reqBody) {
    await delay(ms);

    const { userId, profileUserId, follow } = reqBody;

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== userId) return { message: "Request is forbidden", success: false };

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

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

    return {
        message: "Update was successful",
        success: true,
        profileUser: users[profileUserIndex],
        user: users[userIndex]
    };
}

export {
    getUsersMock,
    getUserMock,
    postUserMock,
    putUserMock,
    deleteUserMock,
    putUserFollowMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function uid() {
    const uid = Date.now().toString(36) +
        Math.random().toString(36).substring(2).padStart(12, 0);
        
    return uid;
}
