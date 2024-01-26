const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String, required: true, minLength: 3, maxLength: 250 }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;