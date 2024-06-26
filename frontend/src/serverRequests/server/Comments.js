import axios from "axios";

async function getComments(reqBody) {
    try {
        const response = await axios.get("/comments");
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function postComment(reqBody) {
    try {
        const { postId, comment, token } = reqBody;
        const body = {
            comment,
            postId
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.post("/comments", body, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putComment(reqBody) {
    try {
        const { id, update, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/comments/${id}`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function deleteComment(reqBody) {
    try {
        const { id, token } = reqBody;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.delete(`/comments/${id}`, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getComments,
    postComment,
    putComment,
    deleteComment
}