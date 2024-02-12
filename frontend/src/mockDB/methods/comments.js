import getComs from "../databases/Comments";
import getUsers from "../databases/Users"

// Comments Section
function getComments(post) {
    const comments = getComs();
    const users = getUsers();

    const commentsArr = [];

    post.comments.forEach(postComment => {
        comments.forEach(comment => {
            if (comment._id === postComment) {
                commentsArr.push(comment);
            }
        });
    });

    populateUsers(commentsArr);

    return commentsArr;

    function populateUsers(comments) {
        comments.forEach(comment => {
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

export {
    getComments
}