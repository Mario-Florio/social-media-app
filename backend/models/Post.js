const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, minLength: 3, maxLength: 250 },
    likes: { type: [Schema.Types.ObjectId], ref: "Users", default: [] },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;