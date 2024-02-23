import { getUsersMock } from "./Users";

const ms = 0;

async function getSessionMock(token) {
    await delay(ms);

    const users = await getUsersMock();
    const payload = {
        authData: { user: null },
        token: false,
        success: false
    }

    for (const user of users) {
        if (token === user._id) {
            payload.authData.user = user;
            payload.token = token;
            payload.success = true;
        }
    }

    return payload;
}

async function postLoginMock(credentials) {
    await delay(ms);

    const { username, password } = credentials;
    const users = await getUsersMock();

    const payload = {
        success: false,
        user: null,
        token: null
    }

    for (const user of users) {
        if (user.username === username && user.password === password) {
            payload.user = user;
            payload.success = true;
            payload.token = user._id;
            break;
        }
    }

    return payload;
}

export {
    getSessionMock,
    postLoginMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
