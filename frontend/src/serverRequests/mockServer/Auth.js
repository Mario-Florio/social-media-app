import fetchMockUsers from "./Users";

async function fetchMockSession() {
    const users = await fetchMockUsers();

    return {
        authData: {
            user: users[1]
        },
        token: "",
        success: true
    }
}

export default fetchMockSession;
