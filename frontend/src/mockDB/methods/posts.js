import getPosts from "../databases/Posts";

// Post Page
function getPost(id) {
    const posts = getPosts();

    let returnPost = null;
    posts.forEach(post => {
        if (post._id.toString() === id) {
            returnPost = post;
        }
    });
    
    return returnPost;
}

export {
    getPost
}