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

    const users = getCollection("Users");
    const forums = getCollection("Forums");

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

    const tokenIsValid = validateToken(id);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users");

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

    const tokenIsValid = validateToken(id);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users");

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

    const tokenIsValid = validateToken(userId);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const users = getCollection("Users");

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