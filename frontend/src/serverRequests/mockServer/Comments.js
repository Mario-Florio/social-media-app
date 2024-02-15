import getUsers from "./Users";

async function getComments() {
    await delay(1000);

    const comments = [
        { _id: 1,  user: 1, post: 0, text: "Hello" },
        { _id: 2,  user: 2, post: 0, text: "Hello" },
        { _id: 3,  user: 3, post: 0, text: "Hello" },
        { _id: 4,  user: 3, post: 0, text: "Hello" },
        { _id: 5,  user: 1, post: 0, text: "Hello" },
        { _id: 6,  user: 2, post: 0, text: "Hello" },
        { _id: 7,  user: 1, post: 0, text: "Hello" },
        { _id: 8,  user: 1, post: 0, text: "Hello" },
        { _id: 9,  user: 2, post: 0, text: "Hello" },
        { _id: 10,  user: 3, post: 0, text: "Hello" },
        { _id: 11,  user: 3, post: 0, text: "Hello" },
        { _id: 12,  user: 2, post: 0, text: "Hello" },
        { _id: 13,  user: 1, post: 0, text: "Hello" },
        { _id: 14,  user: 1, post: 0, text: "Hello" },
        { _id: 15,  user: 2, post: 0, text: "Hello" },
        { _id: 16,  user: 3, post: 0, text: "Hello" },
    ];

    await populateUsers(comments);

    return comments;

    async function populateUsers(comments) {
        const users = await getUsers();
    
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
