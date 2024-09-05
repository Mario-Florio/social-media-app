import requests from "../requests";

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

    populatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return populatedComments;
}

export {
    populateComments
}