const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    posts: { type: [Schema.Types.ObjectId], ref: "Post", default: [] }
}, { timestamps: true});

const Forum = mongoose.model("Forum", ForumSchema);

module.exports = Forum;