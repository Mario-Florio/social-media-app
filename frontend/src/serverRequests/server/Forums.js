import axios from "axios";

async function getForum(reqBody) {
    try {
        const { id } = reqBody;
        const response = await axios.get(`/forums/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getForum
};