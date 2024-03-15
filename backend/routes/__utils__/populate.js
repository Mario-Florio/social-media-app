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

    for (let i = 1; i < 5; i++) {
        const comment = await new Comment({ user, text: "This is a comment on post number "+i }).save();
        const post = await new Post({ user: user._id, text: "This is post number "+i, comments: [comment._id] }).save();
        const profile = await Profile.findById(user.profile).exec();
        await Forum.findByIdAndUpdate(profile.forum, { $push: { posts: post._id } }).exec();
    }
}

async function many() {
    await users();
    const user = await User.findOne({ username: "username1" }).populate("profile").exec();
    const peerUser1 = await User.findOne({ username: "username2" }).populate("profile").exec();
    const peerUser2 = await User.findOne({ username: "username3" }).populate("profile").exec();

    await Profile.findByIdAndUpdate(user.profile._id, { $push: { followers: [peerUser1._id, peerUser2._id], following: [peerUser1._id, peerUser2._id] } }).exec();
    await Profile.findByIdAndUpdate(peerUser1.profile._id, { $push: { followers: [user._id], following: [user._id] } }).exec();
    await Profile.findByIdAndUpdate(peerUser2.profile._id, { $push: { followers: [user._id], following: [user._id] } }).exec();

    for (let i = 1; i < 5; i++) {
        let peerComment = null;
        if (i == 3) {
            peerComment = await new Comment({ user: peerUser1, text: "This is a comment on post number "+i+"by a friend" }).save();
        }
        if (i == 2) {
            peerComment = await new Comment({ user: peerUser2, text: "This is a comment on post number "+i+"by a friend" }).save();
        }
        const comment = await new Comment({ user, text: "This is a comment on post number "+i }).save();
        const post = await new Post({
            user: user._id,
            text: "This is post number "+i,
            comments: peerComment ? [peerComment._id, comment._id] : [comment._id]
        }).save();
        await Forum.findByIdAndUpdate(user.profile.forum, { $push: { posts: post._id } }).exec();
    }

    await postOnPeer1sProfile();
    async function postOnPeer1sProfile() {
        const userComment = await new Comment({ user: user._id, text: "Hello peer" }).save();
        const peerComment = await new Comment({ user: peerUser1._id, text: "Hello user" }).save();
        const post = await new Post({ user: user._id, text: "Hello from user", comments: [peerComment] }).save();
        const peer1sPost = await new Post({ user: peerUser1._id, text: "Hello world", likes: [user._id], comments: [userComment] }).save()
        await Forum.findByIdAndUpdate(peerUser1.profile.forum, { $push: { posts: [post._id, peer1sPost._id] } }).exec();
    }

}

module.exports = {
    users,
    posts,
    many
};