import getForums from "../mockServer/Forums";

// Profile
async function populateForum(id) {
    const forums = await getForums();
    
    let populatedForum = null;
    forums.forEach(forum => {
        if (forum._id === id) {
            populatedForum = forum
        }
    });

    return populatedForum;
}

export {
    populateForum
}