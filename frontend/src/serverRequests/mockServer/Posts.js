import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 0;

async function getPostsMock(reqBody){
    await delay(ms);

    const posts = getCollection("Posts");

    await populateUsers(posts);

    return { message: "Request successful", posts, success: true };

}

async function getPostMock(reqBody) {
    await delay(ms);

    const { id } = reqBody;

    const posts = getCollection("Posts");

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

}

async function postPostMock(reqBody) {
    await delay(ms);

    const { content, forumId, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const posts = getCollection("Posts");
    const forums = getCollection("Forums");

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

    const { id, update, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const posts = getCollection("Posts");

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

    posts[index].text = update.text;
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    await populateUsers([posts[index]]);

    return { message: "Update was successful", success: true, post: posts[index]};

}

async function deletePostMock(reqBody) {
    await delay(ms);

    const { id, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const posts = getCollection("Posts");

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

    posts.splice(index, 1);
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    const forums = getCollection("Forums");

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

    const { id, userId, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false };

    const posts = getCollection("Posts");

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

// UTILS
async function populateUsers(posts) {
    const users = getCollection("Users");
    
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
