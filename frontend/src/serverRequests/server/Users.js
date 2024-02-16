import axios from "axios";

async function fetchUsers() {
    const token = window.localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get("/users", config);
    return response.data.users;
}

export default fetchUsers;