import getUsers from "./Users";

async function getMockSession() {
    const users = await getUsers();

    return {
        authData: {
            user: users[1]
        },
        token: "",
        success: true
    }
}

export default getMockSession;
