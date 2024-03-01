import requests from "./config";

const { getForum } = requests.forums;

// Profile
async function populateForum(id) {
    const { forum } = await getForum({ id });
    
    return forum;
}

export {
    populateForum
}