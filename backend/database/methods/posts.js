const Post = require("../../models/Post");
const Forum = require("../../models/Forum");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

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
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile" } }).exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", success: false };
    }
    
    return { message: "Request successful", post, success: true };
}

async function updatePost(id, update) {
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile" } }).exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", post: null };
    }

    for (const key in update) {
        if (
            key !== "_id" ||
            key !== "user" ||
            key !== "createdAt" ||
            key !== "updatedAt" ||
            key !== "comments" ||
            key !== "likes"
        ) {
            post[key] = update[key];
        }
    }
    await post.save();

    return { success: true, message: "Update was successful", post };
}

async function deletePost(id) {
    const post = await Post.findByIdAndDelete(id).exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", post: null };
    }

    for (const commentId of post.comments) {
        await Comment.findByIdAndDelete(commentId).exec();
    }

    const forums = await Forum.find().exec();
    for (const forum of forums) {
        if (forum.posts.includes(post._id)) {
            await Forum.findByIdAndUpdate(forum._id, {
                $pullAll: {
                    posts: [post._id]
                }
            });
        }
    }

    return { success: true, message: "Deletion was successful" };
}

async function likePost(id, userId) {
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile" } }).exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", success: false };
    }

    if (post.likes.includes(userId)) {
        const filteredLikes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
        post.likes = filteredLikes;
        await post.save();
    } else {
        post.likes.push(userId);
        await post.save();
    }

    return { message: "Update successful", post, success: true };
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost
}