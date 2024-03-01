import requests from "./config";

const { getComments } = requests.comments;

// Comments Section
async function populateComments(commentIds) {
    const { comments } = await getComments();

    const populatedComments = [];
    commentIds.forEach(id => {
        comments.forEach(comment => {
            if (comment._id === id) {
                populatedComments.push(comment);
            }
        });
    });

    return populatedComments;
}

export {
    populateComments
}