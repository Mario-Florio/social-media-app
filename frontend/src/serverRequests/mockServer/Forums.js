
const ms = 0;

async function getForumMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    let returnForum = null;
    forums.forEach(forum => {
        if (forum._id === id) {
            returnForum = forum;
        }
    });

    if (!returnForum) {
        return { message: "Request failed", success: false };
    }
    
    return { message: "Request successful", forum: returnForum, success: true };
}

export {
    getForumMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
