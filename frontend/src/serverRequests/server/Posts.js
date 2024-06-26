import axios from "axios";

async function getPosts(reqBody) {
    try {
        const queryString = getQueryString(reqBody.queryBody);
        const url = queryString ? `/posts${queryString}` : "/posts";
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
    function getQueryString(queryBody) {
        const { userId, timeline, page, limit } = queryBody;

        let queryString = "?";
        userId ? queryString+=`userId=${userId}&` : queryString+="";

        timeline ? queryString+=`timeline=${timeline}&` : queryString+="";

        page ? queryString+=`page=${page}&` : queryString+="";

        limit ? queryString+=`limit=${limit}` : queryString+="";

        return queryString.length > 1 ? queryString : null;
    }
}

async function getPost(reqBody) {
    try {
        const { id } = reqBody;
        const response = await axios.get(`/posts/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function postPost(reqBody) {
    try {
        const { content, forumId, token } = reqBody;
        const body = {
            post: content,
            forum: forumId
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.post("/posts", body, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putPost(reqBody) {
    try {
        const { id, update, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/posts/${id}`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function deletePost(reqBody) {
    try {
        const { id, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.delete(`/posts/${id}`, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putPostLike(reqBody) {
    try {
        const { id, userId, token } = reqBody;
        const body = { userId }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/posts/${id}/like`, body, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getPosts,
    getPost,
    postPost,
    putPost,
    deletePost,
    putPostLike
};