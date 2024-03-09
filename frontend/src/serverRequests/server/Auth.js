import axios from "axios";

async function getSession(token) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const session = await axios.get("/auth/session", config);
        return session.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function postLogin(credentials) {
    const { username, password } = credentials;
    try {
        const res = await axios.post("/auth/login", {
            username,
            password
        });
        const { data } = res;
        return data;
    } catch(err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getSession,
    postLogin
};