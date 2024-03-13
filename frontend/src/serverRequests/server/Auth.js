import axios from "axios";

async function getSession(token) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.get("/auth/session", config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function postLogin(credentials) {
    try {
        const { username, password } = credentials;
        const response = await axios.post("/auth/login", {
            username,
            password
        });
        return response.data;
    } catch(err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getSession,
    postLogin
};