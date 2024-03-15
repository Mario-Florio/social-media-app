const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
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

async function getUsers() {
    const users = await User.find().populate("profile").exec();
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
    const userExists = await User.findById(id).exec();
    if (!userExists) {
        const res = { status: 400, message: "User does not exist", user: null, success: false };
        return res;
    }

    await User.findByIdAndDelete(id).exec();

    const res = { success: true, message: "Deletion was successful" };
    return res;
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