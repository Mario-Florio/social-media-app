import axios from "axios";

async function getUsers(reqBody={}) {
    try {
        const queryString = reqBody.queryBody ? getQueryString(reqBody.queryBody) : "";
        const url = queryString ? `/users${queryString}` : "/users";
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
    function getQueryString(queryBody) {
        const { search, populate, page, limit } = queryBody;

        let queryString = "?";
        search ? queryString+=`search=${search}&` : queryString+="";

        populate ? queryString+=`populate=${JSON.stringify(populate)}&` : queryString+="";

        page ? queryString+=`page=${page}&` : queryString+="";

        limit ? queryString+=`limit=${limit}` : queryString+="";

        return queryString.length > 1 ? queryString : null;
    }
}

async function getUser(reqBody) {
    try {
        const { id } = reqBody;
        const response = await axios.get(`/users/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function postUser(reqBody) {
    try {
        const { credentials } = reqBody;
        const response = await axios.post("/users", { credentials });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putUser(reqBody) {
    try {
        const { id, update, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/users/${id}`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function deleteUser(reqBody) {
    try {
        const { id, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.delete(`/users/${id}`, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putProfile(reqBody) {
    try {
        const { id, token, update } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/users/${id}/profile`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putUserFollow(reqBody) {
    try {
        const { profileUserId, userId, follow, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const body = {
            userId,
            follow
        }

        const response = await axios.put(`/users/${profileUserId}/profile/follow`, body, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putProfileDefaultImg(reqBody) {
    try {
        const { id, token, update } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/users/${id}/profile/default-img`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
    putProfile,
    putUserFollow,
    putProfileDefaultImg
};