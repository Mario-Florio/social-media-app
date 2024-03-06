import delay from "./__utils__/delay";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 0;

async function getComments(reqBody) {
    await delay(ms);

    const commentsJSON = window.localStorage.getItem("Comments");
    const comments = JSON.parse(commentsJSON);

    await populateUsers(comments);

    return { message: "Request successful", comments, success: true };

    async function populateUsers(comments) {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);
    
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

    const commentsJSON = window.localStorage.getItem("Comments");
    const comments = JSON.parse(commentsJSON);
    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

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