const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(credentials) {
    const { username, password } = credentials;
    const userExists = await User.findOne({ username }).exec();
    if (userExists) {
        return { status: 404, message: "User already exists", success: false };
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const forum = await new Forum().save();
        const profile = await new Profile({ forum }).save();
        const user = await new User({
            username,
            password: hashedPassword,
            profile
        }).save();

        return { message: "Success: user has been created", user, success: true };
    }
}

async function authorizeUser(credentials) {
    const { username, password } = credentials;
    const user = await User.findOne({ username }).select("+password").populate("profile").exec();
    if (!user) {
        return { status: 400, message: "User does not exist", user: false, success: false };
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ user }, process.env.SECRET, {expiresIn: "1h"});
            user.password = "";
            const res = { message: "Login was successful", user, token, success: true };
            return res;
        } else {
            return { status: 404, message: "Password does not match", user: false, success: false };
        }
    }
}

async function getUsers(limit=10, page=0, search, populate) {
    const popObj = {};
    if (populate) {
        const userIds = [];
        for (const key in populate) {
            const user = await User.findById(populate[key]).populate("profile").exec();
            Array.isArray(user.profile[key]) && userIds.push(...user.profile[key]);
        }
        popObj._id = { $in: userIds };
    }

    const searchObj = search ? { username: { $regex: search } } : {};

    const queryObj = { ...popObj, ...searchObj };

    const users = await User.find(queryObj)
        .limit(limit)
        .skip(limit * page)
        .sort({ username: 1 })
        .populate("profile")
        .exec();
    return users;
}

async function getUserById(id) {
    const user = await User.findById(id).populate("profile").exec();
    
    if (!user) {
        return { status: 400, message: "User does not exist", success: false };
    }

    return { message: "Request successful", user, success: true };
}

async function updateUser(id, update) {
    const user = await User.findById(id).populate("profile").exec();

    if (!user) {
        return { status: 400, message: "User does not exist", user: null, success: false };
    }

    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(update.password, salt);
        update.password = hashedPassword;
    }

    for (const key in update) {
        if (
            key !== "_id" ||
            key !== "profile" ||
            key !== "createdAt" ||
            key !== "updatedAt"
        ) {
            user[key] = update[key];
        }
    }

    await user.save();

    return { user, message: "Update was successful", success: true };
}

async function deleteUser(id) {
    const user = await User.findById(id).exec();

    if (!user) {
        const res = { status: 400, message: "User does not exist", user: null, success: false };
        return res;
    }

    // 1. delete all refs to users comments in posts (i.e. post.comments)
    const posts = await Post.find().populate("comments").exec();
    for (const post of posts) {
        for (const comment of post.comments) {
            if (comment.user.toString() === user._id.toString()) {
                await Post.findByIdAndUpdate(post._id, { $pull: { comments: comment._id } }).exec();
            }
        }
    }

    // 2. delete all comments made by user (i.e. comment.user)
    await Comment.deleteMany({ user: user._id }).exec();

    // 3. delete all refs to user in posts (i.e. post.likes)
    await Post.updateMany({ likes: user._id }, { $pull: { likes: user._id } }).exec();

    // 4. delete all posts from Posts ref'd in users forum
    const usersProfile = await Profile.findById(user.profile).populate("forum").exec();
    const commentIdsFromDeletedPosts = []; // used in step 6
    for (const postId of usersProfile.forum.posts) {
        const post = await Post.findByIdAndDelete(postId).exec();
        commentIdsFromDeletedPosts.push(...post.comments);
    }

    // 5. delete all refs to user in forums (i.e. forums.posts)
    const forums = await Forum.find().populate("posts").exec();
    for (const forum of forums) {
        for (const post of forum.posts) {
            if (post.user.toString() === user._id.toString()) {
                await Forum.findByIdAndUpdate(forum._id, { $pull: { posts: post._id } }).exec();
            }
        }
    }
    
    // 6. delete all comments that existed on users deleted posts (i.e. user.profile.forum.posts.forEach(comment))
    for (const commentId of commentIdsFromDeletedPosts) {
        await Comment.findByIdAndDelete(commentId).exec();
    }

    // 7. delete any posts made by user
    await Post.deleteMany({ user: user._id }).exec();

    // 8. delete users forum
    await Forum.findByIdAndDelete(usersProfile.forum).exec();

    // 9. delete all refs to user in Profiles (i.e. profile.following / profile.followers)
    await Profile.updateMany({ following: user._id }, { $pull: { following: user._id } }).exec();
    await Profile.updateMany({ followers: user._id }, { $pull: { followers: user._id } }).exec();

    // 10. delete users profile
    await Profile.findByIdAndDelete(user.profile).exec();

    // 11. delete user
    await User.findByIdAndDelete(id).exec();

    return { success: true, message: "Deletion was successful" };
}

async function updateProfile(userId, update) {
    const user = await User.findById(userId).exec();

    if (!user) {
        return { status: 400, message: "User does not exist", success: false };
    }

    for (const key in update) {
        if (
            key === "_id" ||
            key === "forum" ||
            key === "createdAt" ||
            key === "updatedAt"
        ) {
            delete update[key];
        }
    }

    const profile = await Profile.findByIdAndUpdate(user.profile, update, { new: true }).exec();
    user.profile = profile;

    return { user, message: "Update was successful", success: true };
}

async function followProfile(userId, peerUserId, follow) {
    const user = await User.findById(userId).populate("profile").exec();
    const peerUser = await User.findById(peerUserId).populate("profile").exec();

    if (!user || !peerUser) {
        return { status: 400, message: "User does not exist", success: false };
    }

    if (follow) {
        if (
            !user.profile.following.includes(peerUser._id) &&
            !peerUser.profile.followers.includes(user._id)
        ) {
            const updatedUserProfile = await Profile
                .findByIdAndUpdate(user.profile._id, { $push: { following: peerUser._id } }, { new: true })
                .exec();
            user.profile = updatedUserProfile;

            const updatedPeerUserProfile = await Profile
                .findByIdAndUpdate(peerUser.profile._id, { $push: { followers: user._id } }, { new: true })
                .exec();
            peerUser.profile = updatedPeerUserProfile;
        } else {
            return { status: 404, message: "Already following user", success: false };
        }
    }

    if (!follow) {
        if (
            user.profile.following.includes(peerUser._id) &&
            peerUser.profile.followers.includes(user._id)
        ) {
            const updatedUserProfile = await Profile
                .findByIdAndUpdate(user.profile._id, { $pull: { following: peerUser._id } }, { new: true })
                .exec();
            user.profile = updatedUserProfile;

            const updatedPeerUserProfile = await Profile
                .findByIdAndUpdate(peerUser.profile._id, { $pull: { followers: user._id } }, { new: true })
                .exec();
            peerUser.profile = updatedPeerUserProfile;
        } else {
            return { status: 404, message: "Already not following user", success: false };
        }
    }

    return { message: "Update was successful", clientUser: user, peerUser, success: true };
}

module.exports = {
    registerUser,
    authorizeUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateProfile,
    followProfile
}