import axios from "axios";

async function getUsers() {
    try {
        const response = await axios.get("/users");
        return response.data.users;
    } catch (err) {
        console.log(err);
    }
}

async function getUser(id) {
    try {
        const response = await axios.get(`/users/${id}`);
        return response.data.user;
    } catch (err) {
        console.log(err);
    }
}

async function postUser(credentials) {
    try {
        const response = await axios.post("/users", credentials);
        return response.data.user;
    } catch (err) {
        console.log(err);
    }
}

async function putUser(id, update) {
    try {
        const token = window.localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/users/${id}`, update, config);
        return response.data.user;
    } catch (err) {
        console.log(err);
    }
}

async function deleteUser(id) {
    try {
        const token = window.localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.delete(`/users/${id}`, config);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser
};