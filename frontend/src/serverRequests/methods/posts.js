import request from "./config";

const { getPosts } = request.posts;

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

export {
    populatePosts
}