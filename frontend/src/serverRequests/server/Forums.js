import axios from "axios";

async function fetchForum(id) {
    const token = window.localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`/forums/${id}`, config);
    return response.data.forum;
}

export default fetchForum;