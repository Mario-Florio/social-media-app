import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";
import getPhotoUrl from "./__utils__/getPhotoUrl";

const ms = 0;

async function getCommentsMock(reqBody) {
    await delay(ms);

    const comments = getCollection("Comments");

    await populateUsers(comments);

    return { message: "Request Successful", comments, success: true };
}

async function postCommentMock(reqBody) {
    await delay(ms);

    const { postId, comment, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

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

    return { message: "Request Successful", success: true, comment: newComment };
}

async function putCommentMock(reqBody) {
    const { id, update, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

    const comments = getCollection("Comments");

    let commentFound = false;
    let index = 0;
    for (const comment of comments) {
        if (comment._id === id) {
            commentFound = true;
            break;
        }
        index++;
    }

    if (!commentFound) return { message: "Request Failed: Comment does not exist", success: false };

    comments[index].text = update.text;
    window.localStorage.setItem("Comments", JSON.stringify(comments));

    await populateUsers([comments[index]]);

    return { message: "Update successful", comment: comments[index], success: true }
}

async function deleteCommentMock(reqBody) {
    const { id, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

    const comments = getCollection("Comments");
    const posts = getCollection("Posts");

    for (const post of posts) {
        const filteredComments = post.comments.filter(commentId => commentId !== id);
        post.comments = filteredComments;
    }

    const filteredComments = comments.filter(comment => comment._id !== id);
    if (filteredComments.length === comments.length) return { message: "Request Failed: Comment not found", success: false }

    window.localStorage.setItem("Comments", JSON.stringify(filteredComments));
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    return { message: "Deletion Successful", success: true }
}

export {
    getCommentsMock,
    postCommentMock,
    putCommentMock,
    deleteCommentMock
};

// UTILS
async function populateUsers(comments) {
    const users = getCollection("Users");
    
    comments.forEach(async comment => {
        let userData = null;
        users.forEach(user => {
            if (user._id === comment.user) {
                userData = user;
            }
        });
        
        getPhotoUrl(userData.profile.picture);
        getPhotoUrl(userData.profile.coverPicture);

        comment.user = userData;
    });
}
