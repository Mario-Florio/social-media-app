import getUsers from "./Users";

async function getPosts() {
    await delay(1000);

    const posts = [
        { _id: 1, user: 1, text: "Hello", likes: [2, 3], comments: [2, 3, 5, 6, 11, 12, 13, 14, 15, 16], createdAt: new Date() },
        { _id: 2, user: 1, text: "Hello", likes: [3], comments: [4, 7], createdAt: new Date() },
        { _id: 3, user: 1, text: "Hello", likes: [], comments: [1], createdAt: new Date() },
        { _id: 4, user: 2, text: "Hello", likes: [1, 3], comments: [8, 9], createdAt: new Date() },
        { _id: 5, user: 2, text: "Hello", likes: [1], comments: [10], createdAt: new Date() },
        { _id: 6, user: 2, text: "Hello", likes: [3], comments: [], createdAt: new Date() },
        { _id: 7, user: 3, text: "Hello", likes: [], comments: [], createdAt: new Date() },
        { _id: 8, user: 3, text: "Hello", likes: [1, 2], comments: [], createdAt: new Date() },
        { _id: 9, user: 3, text: "Hello", likes: [1], comments: [], createdAt: new Date() },
        { _id: 10, user: 3, text: "Hello", likes: [2], comments: [], createdAt: new Date() }
    ];

    await populateUsers(posts);

    return posts;

    async function populateUsers(posts) {
        const users = await getUsers();
        
        posts.forEach(async post => {
            let userData = null;
            users.forEach(user => {
                if (user._id === post.user) {
                    userData = user;
                }
            });
            post.user = userData;
        });
    };
}

export default getPosts;

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
