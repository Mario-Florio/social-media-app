import { getUsersMock } from "./Users";

const ms = 0;

async function getComments() {
    await delay(ms);

    const commentsJSON = window.localStorage.getItem("Comments");
    const comments = JSON.parse(commentsJSON);

    await populateUsers(comments);

    return comments;

    async function populateUsers(comments) {
        const users = await getUsersMock();
    
        comments.forEach(async comment => {
            let userData = null;
            users.forEach(user => {
                if (user._id === comment.user) {
                    userData = user;
                }
            });
    
            comment.user = userData;
        });
    }
}

export default getComments;

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
