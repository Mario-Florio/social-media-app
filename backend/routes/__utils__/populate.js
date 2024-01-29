const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const bcrypt = require("bcryptjs");

async function users() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    for (let i = 1; i < 5; i++) {
        const user = await new User({ username: "username"+i, password: hashedPassword }).save();
        const forum = await new Forum({ heading: `${user.username}'s wall` }).save();
        await new Profile({ user, forum, bio: "This is a bio..." }).save();
    }
}

async function forums() {
    for (let i = 1; i < 5; i++) {
        await new Forum({ heading: "Forum"+i }).save();
    }
}

module.exports = {
    users,
    forums
};