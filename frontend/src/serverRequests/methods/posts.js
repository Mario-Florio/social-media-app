import methods from "./config";

const { getPosts } = methods;

// Profile & Home
async function populatePosts(postIds) {
    const posts = await getPosts();

    const populatedPosts = [];
    postIds.forEach(id => {
        posts.forEach(post => {
            if (post._id === id) {
                populatedPosts.push(post);
            }
        });
    });

    return populatedPosts;
}

// Post page
async function populatePost(id) {
    const posts = await getPosts();

    let populatedPost = null;
    posts.forEach(post => {
        if (post._id.toString() === id) {
            populatedPost = post;
        }
    });
    
    return populatedPost;
}

export {
    populatePosts,
    populatePost
}