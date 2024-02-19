import axios from "axios";

async function getPosts() {
    try {
        const response = await axios.get("/posts");
        return response.data.posts;
    } catch (err) {
        console.log(err);
    }
}

async function getPost(id) {
    try {
        const response = await axios.get(`/posts/${id}`);
        return response.data.post;
    } catch (err) {
        console.log(err);
    }
}

async function postPost(content) {
    try {
        const token = window.localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.post("/posts", content, config);
        return response.data.post;
    } catch (err) {
        console.log(err);
    }
}

async function putPost(id, update) {
    try {
        const token = window.localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/posts/${id}`, update, config);
        return response.data.post;
    } catch (err) {
        console.log(err);
    }
}

async function deletePost(id) {
    try {
        const token = window.localStorage.getItem("token");
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