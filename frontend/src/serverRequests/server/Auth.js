import axios from "axios";

async function getSession(token) {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const session = await axios.get("/auth/session", config);
    return session.data;
}

export default getSession;