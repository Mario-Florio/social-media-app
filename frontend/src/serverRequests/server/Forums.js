import axios from "axios";

async function getForum(reqBody) {
    const { id } = reqBody;
    const response = await axios.get(`/forums/${id}`);
    return response.data;
}

export {
    getForum
};