import axios from "axios";

async function getAlbums(reqBody) {
    try {
        const queryString = getQueryString(reqBody.queryBody);
        const url = queryString ? `/photo-albums${queryString}` : "/photo-albums";
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

async function postAlbum(reqBody = {}) {
    try {
        const { album, token } = reqBody;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.post("/photo-albums", album, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

async function putAlbum(reqBody = {}) {
    try {
        const { id, update, token } = reqBody;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.put(`/photo-albums/${id}`, update, config);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response.data;
    }
}

export {
    getAlbums,
    postAlbum,
    putAlbum
};