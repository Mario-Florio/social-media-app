import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 0;

async function getComments(reqBody) {
    await delay(ms);

    const comments = getCollection("Comments");

    await populateUsers(comments);

    return { message: "Request successful", comments, success: true };

    async function populateUsers(comments) {
        const users = getCollection("Users");
    
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

async function postComment(reqBody) {
    await delay(ms);

    const { postId, comment } = reqBody;

    const tokenIsValid = validateToken(comment.user);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const comments = getCollection("Comments");
    const posts = getCollection("Posts");

    const newComment = {
        _id: uid(),
        user: comment.user,
        text: comment.text,
    }

    comments.push(newComment);

    for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id === postId) {
            posts[i].comments.push(newComment._id);
        }
    }

    window.localStorage.setItem("Comments", JSON.stringify(comments));
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    return { message: "Request successful", success: true, comment: newComment };
}

export {
    getComments,
    postComment
};