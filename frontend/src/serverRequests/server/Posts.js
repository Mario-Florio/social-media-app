import axios from "axios";

async function getPosts(reqBody) {
    try {
        const response = await axios.get("/posts");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

async function getPost(reqBody) {
    try {
        const { id } = reqBody;
        const response = await axios.get(`/posts/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
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
    }
}

export {
    getPosts,
    getPost,
    postPost,
    putPost,
    deletePost
};