import methods from "./config";

const { getForum } = methods;

// Profile
async function populateForum(id) {
    const forum = await getForum(id);
    
    return forum;
}

export {
    populateForum
}