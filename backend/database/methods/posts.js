const Post = require("../../models/Post");

async function createPost(data) {
    const post = await new Post(data).save();
    const res = { message: "Success: post has been created", success: true };
    return res;
}

async function getPosts() {
    const posts = await Post.find()
        .populate({ path: "user", populate: { path: "profile" } }).exec();
    return posts;
}

async function getPostById(id) {
    try {
        const post = await Post.findById(id)
            .populate({ path: "user", populate: { path: "profile" } }).exec();
        return post;
    } catch(err) {
        return null;
    }
}

async function updatePost(id, update) {
    const postExists = await Post.findById(id).exec();
    if (!postExists) {
        const res = { status: 400, message: "Post does not exist", post: null };
        return res;
    }

    await Post.findByIdAndUpdate(id, update).exec();
    const post = await Post.findById(id).exec();

    const res = { success: true, message: "Update was successful", post };
    return res;
}

async function deletePost(id) {
    const postExists = await getPostById(id);
    if (!postExists) {
        const res = { status: 400, message: "Post does not exist", post: null };
        return res;
    }

    await Post.findByIdAndDelete(id).exec();

    const res = { success: true, message: "Deletion was successful" };
    return res;
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
}