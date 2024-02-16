import axios from "axios";

async function fetchPosts() {
    const token = window.localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get("/posts", config);
    return response.data.posts;
}

export default fetchPosts;