import { getUsersMock } from "./Users";

setupPostsCollection();

const ms = 0;

async function getPostsMock(){
    await delay(ms);

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    await populateUsers(posts);

    return posts;

    async function populateUsers(posts) {
        const users = await getUsersMock();
        
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

async function getPostMock(id) {
    await delay(ms);

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    let postFound = null;
    for (const post of posts) {
        if (post._id === id) {
            postFound = post;
        }
    }

    await populateUsers([postFound]);

    return postFound;

    async function populateUsers(posts) {
        const users = await getUsersMock();
        
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

async function postPostMock(content, forumId) {
    await delay(ms);

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== content.user) return { message: "Request is forbidden", success: false };

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);
    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    const _id = posts[posts.length-1]._id + 1;
    const newPost = {
        _id,
        user: content.user,
        text: content.text,
        likes: [],
        comments: [],
        createdAt: new Date()
    }

    for (const forum of forums) {
        if (forum._id === forumId) {
            forum.posts.push(newPost._id);
        }
    }

    posts.push(newPost);
    window.localStorage.setItem("Posts", JSON.stringify(posts));
    window.localStorage.setItem("Forums", JSON.stringify(forums));

    return { message: "Post was successful", success: true, post: newPost };
}

async function putPostMock(update) {
    await delay(ms);

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== update.user) return { message: "Request is forbidden", success: false };

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    let postFound = false;
    let index = 0;
    for (const post of posts) {
        if (post._id === update._id) {
            postFound = true;
            break;
        }
        index++;
    }

    if (!postFound) return { message: "Post does not exist", success: false };

    posts[index] = update;
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    return { message: "Update was successful", success: true, post: update};
}

async function deletePostMock(id) {
    await delay(ms);

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);


    let postFound = false;
    let userId = null;
    let index = 0;
    for (const post of posts) {
        if (post._id === id) {
            postFound = true;
            userId = post.user;
            break;
        }
        index++;
    }

    if (!postFound) return { message: "Post does not exist", success: false };
    if (token !== userId) return { message: "Request is forbidden", success: false };

    posts.splice(index, 1);
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    return { message: "Deletion was successful", success: true };
}

async function putPostLikeMock(id, userId) {
    await delay(ms);

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== userId) return { message: "Request is forbidden", success: false};

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    let postFound = false;
    let index = 0;
    for (const post of posts) {
        if (post._id === id) {
            postFound = true;
            break;
        }
        index++;
    }

    if (!postFound) return { message: "Post does not exist", success: false };

    posts[index].likes.includes(userId) ?
        posts[index].likes.splice(posts[index].likes.indexOf(userId), 1) :
        posts[index].likes.push(userId);
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    return { message: "Update was successful", success: true };
}

export {
    getPostsMock,
    getPostMock,
    postPostMock,
    putPostMock,
    deletePostMock,
    putPostLikeMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setupPostsCollection() {
    const posts = [
        { _id: "1", user: "1", text: "Hello", likes: ["2", "3"], comments: ["2", "3", "5", "6", "11", "12", "13", "14", "15", "16"], createdAt: new Date() },
        { _id: "2", user: "1", text: "Hello", likes: ["3"], comments: ["4", "7"], createdAt: new Date() },
        { _id: "3", user: "1", text: "Hello", likes: [], comments: ["1"], createdAt: new Date() },
        { _id: "4", user: "2", text: "Hello", likes: ["1", "3"], comments: ["8", "9"], createdAt: new Date() },
        { _id: "5", user: "2", text: "Hello", likes: ["1"], comments: ["10"], createdAt: new Date() },
        { _id: "6", user: "2", text: "Hello", likes: ["3"], comments: [], createdAt: new Date() },
        { _id: "7", user: "3", text: "Hello", likes: [], comments: [], createdAt: new Date() },
        { _id: "8", user: "3", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "9", user: "3", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "10", user: "3", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() }
    ];

    window.localStorage.setItem("Posts", JSON.stringify(posts));
}
