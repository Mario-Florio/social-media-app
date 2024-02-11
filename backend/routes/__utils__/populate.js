const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const bcrypt = require("bcryptjs");

async function users() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    for (let i = 1; i < 5; i++) {
        const forum = await new Forum().save();
        const profile = await new Profile({ bio: "This is a bio...", forum }).save();
        await new User({ username: "username"+i, password: hashedPassword, profile }).save();
    }
}

async function posts() {
    let user = await User.findOne({ username: "username1" }).exec();
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password", salt);
        const forum = await new Forum().save();
        const profile = await new Profile({ bio: "This is a bio...", forum }).save();
        user = await new User({ username: "username", password: hashedPassword, profile }).save();
    }

    const posts = [];
    for (let i = 1; i < 5; i++) {
        const comment = await new Comment({ user: user._id, text: "This is a comment on post number "+i }).save();
        const post = await new Post({ user: user._id, text: "This is post number "+i, comments: comment }).save();
        await User.findByIdAndUpdate(user._id, { $push: { posts: post._id } }).exec();
    }
}

module.exports = {
    users,
    posts
};