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
        const forum = await new Forum().save();
        await new Profile({ user, forum, bio: "This is a bio..." }).save();
    }
}

module.exports = {
    users
};