const Post = require("../../models/Post");
const Forum = require("../../models/Forum");

async function createPost(data, forumId) {
    const post = await new Post(data).save();
    await Forum.findByIdAndUpdate(forumId, { $push: { posts: post } }).exec();
    const res = { message: "Success: post has been created", post, success: true };
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
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile" } }).exec();

    const res = { success: true, message: "Update was successful", post };
    return res;
}

async function deletePost(id) {
    const postExists = await getPostById(id);
    if (!postExists) {
        const res = { status: 400, message: "Post does not exist", post: null };
        return res;
    }

    const forums = await Forum.find().exec();
    for (const forum of forums) {
        if (forum.posts.includes(postExists._id)) {
            await Forum.findByIdAndUpdate(forum._id, {
                $pullAll: {
                    posts: [postExists._id]
                }
            });
        }
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