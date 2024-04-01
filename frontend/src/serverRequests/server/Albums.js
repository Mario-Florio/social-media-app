import axios from "axios";

async function getAlbums(reqBody) {
    try {
        const queryString = getQueryString(reqBody.queryBody);
        const url = queryString ? `/photo-albums${queryString}` : "/albums";
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

export {
    getAlbums
};