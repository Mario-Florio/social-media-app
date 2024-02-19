import axios from "axios";

async function getForum(id) {
    const response = await axios.get(`/forums/${id}`);
    return response.data.forum;
}

export {
    getForum
};