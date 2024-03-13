import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";

const ms = 0;

async function getForumMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const forums = getCollection("Forums");

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