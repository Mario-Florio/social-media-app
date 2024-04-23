import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";
import getPhotoUrl from "./__utils__/getPhotoUrl";

const ms = 0;

async function getPostsMock(reqBody){
    await delay(ms);

    const { queryBody } = reqBody;

    const limit = queryBody.limit || 10;
    const page = queryBody.page || 0;

    let posts = getCollection("Posts");

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (queryBody.userId && queryBody.timeline) {
        const users = getCollection("Users");
        const [ user ] = users.filter((user, i) => user._id === queryBody.userId);
        posts = posts.filter(post => {
            let isTimeline = false;
            if (post.user === user._id) return true;
            for (let i = 0; i < user.profile.following.length; i++) {
                if (post.user === user.profile.following[i]) {
                    isTimeline = true;
                }
            }
            return isTimeline;
        });
    }

    if (queryBody.userId && !queryBody.timeline) {
        posts = posts.filter(post => post.user === queryBody.userId);
    }

    posts = posts.filter((post, i) => (i+1 > page * limit) && (i+1 <= page * limit + limit));

    await populateUsers(posts);

    return { message: "Request Successful", posts, success: true };
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
        return { message: "Request Failed: Post not found", success: false };
    }

    await populateUsers([postFound]);

    return { message: "Request Successful", post: postFound, success: true };
}

async function postPostMock(reqBody) {
    await delay(ms);

    const { content, forumId, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

    const posts = getCollection("Posts");
    const forums = getCollection("Forums");
    const users = getCollection("Users");

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

    await populateUsers([newPost]);

    return { message: "Request Successful", success: true, post: newPost };
}

async function putPostMock(reqBody) {
    await delay(ms);

    const { id, update, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

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

    if (!postFound) return { message: "Request Failed: Post does not exist", success: false };

    posts[index].text = update.text;
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    await populateUsers([posts[index]]);

    return { message: "Update Successful", success: true, post: posts[index]};

}

async function deletePostMock(reqBody) {
    await delay(ms);

    const { id, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

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

    if (!postFound) return { message: "Request Failed: Post does not exist", success: false };

    const [ post ] = posts.splice(index, 1);
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    const comments = getCollection("Comments");

    const filteredComments = comments.filter(comment => {
        let isPost = false;
        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i] === comment._id) {
                isPost = true;
            }
        }
        return !isPost;
    });

    window.localStorage.setItem("Comments", JSON.stringify(filteredComments));

    const forums = getCollection("Forums");

    for (let i = 0; i < forums.length; i++) {
        const filteredPosts = forums[i].posts.filter(postId => postId !== post._id);
        forums[i].posts = filteredPosts;
    }

    window.localStorage.setItem("Forums", JSON.stringify(forums));

    return { message: "Deletion Successful", success: true };
}

async function putPostLikeMock(reqBody) {
    await delay(ms);

    const { id, userId, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false };

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

    if (!postFound) return { message: "Request Failed: Post does not exist", success: false };

    posts[index].likes.includes(userId) ?
        posts[index].likes.splice(posts[index].likes.indexOf(userId), 1) :
        posts[index].likes.push(userId);
    window.localStorage.setItem("Posts", JSON.stringify(posts));

    const post = posts[index];

    await populateUsers([post]);

    return { message: "Update Successful", post, success: true };
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

        getPhotoUrl(userData.profile.picture);
        getPhotoUrl(userData.profile.coverPicture);

        post.user = userData;
    });
};
