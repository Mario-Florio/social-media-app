const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

async function getComments() {
    const comments = await Comment.find()
        .populate({ path: "user", populate: { path: "profile" } }).exec();
    return comments;
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

module.exports = {
    getComments,
    createComment
}