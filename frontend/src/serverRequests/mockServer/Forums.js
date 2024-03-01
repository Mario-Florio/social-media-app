
const ms = 0;

async function getForumMock(id) {
    await delay(ms);

    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    let returnForum = null;
    forums.forEach(forum => {
        if (forum._id === id) {
            returnForum = forum;
        }
    })
    
    return returnForum;
}

export {
    getForumMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
