import { getUsersMock } from "./Users";

async function getSessionMock(token) {
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