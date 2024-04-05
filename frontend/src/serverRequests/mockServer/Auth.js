import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import getPhotoUrl from "./__utils__/getPhotoUrl";

const ms = 0;

async function getSessionMock(token) {
    await delay(ms);

    const users = getCollection("Users");

    const payload = {
        user: null ,
        token: false,
        success: false
    }

    for (const user of users) {
        if (token === user._id) {
            payload.user = user;
            payload.token = token;
            payload.success = true;
        }
    }

    getPhotoUrl(payload.user.profile.picture);
    getPhotoUrl(payload.user.profile.coverPicture);

    return payload;
}

async function postLoginMock(credentials) {
    await delay(ms);

    const { username, password } = credentials;
    
    const users = getCollection("Users", { showHidden: "password" });

    const payload = {
        success: false,
        user: null,
        token: null
    }

    for (const user of users) {
        if (user.username === username && user.password === password) {
            delete user.password;
            payload.user = user;
            payload.success = true;
            payload.token = user._id;
            break;
        }
    }

    getPhotoUrl(payload.user.profile.picture);
    getPhotoUrl(payload.user.profile.coverPicture);

    return payload;
}

export {
    getSessionMock,
    postLoginMock
};