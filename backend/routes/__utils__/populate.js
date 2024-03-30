const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const bcrypt = require("bcryptjs");

async function users() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    for (let i = 1; i < 20; i++) {
        const forum = await new Forum().save();
        const profile = await new Profile({ bio: "This is a bio...", forum }).save();
        await new User({ username: "username"+i, password: hashedPassword, profile }).save();
    }
}

async function posts() {
    let user1 = await User.findOne({ username: "username1" }).exec();
    if (!user1) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password", salt);
        const forum = await new Forum().save();
        const profile = await new Profile({ bio: "This is a bio...", forum }).save();
        user1 = await new User({ username: "username1", password: hashedPassword, profile }).save();
    }
    let user2 = await User.findOne({ username: "username2" }).exec();
    if (!user2) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password", salt);
        const forum = await new Forum().save();
        const profile = await new Profile({ bio: "This is a bio...", forum, following: [user1] }).save();
        user2 = await new User({ username: "username2", password: hashedPassword, profile }).save();
    }

    for (let i = 1; i < 20; i++) {
        let user = user1;
        if (i % 2 === 0) user = user2;
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

async function albums() {
    let user = await User.findOne({ username: "username1" }).exec();
    if (!user) {
        await users();
        user = await User.findOne({ username: "username1" }).exec();
    }
    for (let i = 1; i < 11; i++) {
        await new Album({ name: `album${i}`, desc: `This is a description for album${i}`, user }).save();
    }
}

module.exports = {
    users,
    posts,
    many,
    albums
};