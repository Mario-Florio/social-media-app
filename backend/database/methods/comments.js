const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

async function getComments() {
    const comments = await Comment.find()
        .populate({ path: "user", populate: { path: "profile" } }).exec();
    return comments;
}

async function getCommentById(id) {
    const comment = await Comment.findById(id).exec();
    return comment;
}

async function createComment(postId, commentData) {
    const postExists = await Post.findById(postId).exec();

    if (!postExists) {
        return { status: 400, message: "Post does not exist", success: false };
    }

    const comment = await new Comment(commentData).save();

    postExists.comments.push(comment._id);
    await postExists.save();

    return { message: "Request successful", success: true, comment };
}

async function updateComment(id, update) {
    const comment = await Comment.findById(id)
        .populate({ path: "user", populate: { path: "profile" } }).exec();

    if (!comment) {
        return { status: 400, message: "Comment does not exist", comment: null };
    }

    for (const key in update) {
        if (
            key !== "_id" ||
            key !== "user" ||
            key !== "createdAt" ||
            key !== "updatedAt"
        ) {
            comment[key] = update[key];
        }
    }
    await comment.save();

    return { success: true, message: "Update was successful", comment };
}

async function deleteComment(id) {
    const comment = await Comment.findByIdAndDelete(id).exec();

    if (!comment) {
        return { status: 400, message: "Comment does not exist", comment: null };
    }

    const posts = await Post.find().exec();
    for (const post of posts) {
        if (post.comments.includes(comment._id)) {
            await Post.findByIdAndUpdate(post._id, {
                $pullAll: {
                    comments: [comment._id]
                }
            });
        }
    }

    return { success: true, message: "Deletion was successful" };
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
}