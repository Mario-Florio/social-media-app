import delay from "./__utils__/delay";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 0;

async function getPostsMock(reqBody){
    await delay(ms);

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    await populateUsers(posts);

    return { message: "Request successful", posts, success: true };

    async function populateUsers(posts) {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);
        
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

async function getPostMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);

    let postFound = null;
    for (const post of posts) {
        if (post._id === id) {
            postFound = post;
        }
    }

    if (!postFound) {
        return { message: "Request failed: Post not found", success: false };
    }

    await populateUsers([postFound]);

    return { message: "Request successful", post: postFound, success: true };

    async function populateUsers(posts) {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);
        
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

async function postPostMock(reqBody) {
    await delay(ms);

    const { content, forumId } = reqBody;

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== content.user) return { message: "Request is forbidden", success: false };

    const postsJSON = window.localStorage.getItem("Posts");
    const posts = JSON.parse(postsJSON);
    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    const _id = uid();
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

async function putPostMock(reqBody) {
    await delay(ms);

    const { update } = reqBody;

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

    await populateUsers([update]);

    return { message: "Update was successful", success: true, post: update};

    async function populateUsers(posts) {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);
        
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

async function deletePostMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

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

    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    for (let i = 0; i < forums.length; i++) {
        for (let j = 0; j < forums[i].posts.length; j++) {
            if (forums[i].posts[j] === id) {
                forums[i].posts.splice(j, 1);
            }
        }
    }

    window.localStorage.setItem("Forums", JSON.stringify(forums));

    return { message: "Deletion was successful", success: true };
}

async function putPostLikeMock(reqBody) {
    await delay(ms);

    const { id, userId } = reqBody;

    const tokenJSON = window.localStorage.getItem("token");
    const token = JSON.parse(tokenJSON);
    if (token !== userId) return { message: "Request is forbidden", success: false };

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

    const post = posts[index];

    await populateUsers([post]);
    async function populateUsers(posts) {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);
        
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

    return { message: "Update was successful", post, success: true };
}

export {
    getPostsMock,
    getPostMock,
    postPostMock,
    putPostMock,
    deletePostMock,
    putPostLikeMock
};