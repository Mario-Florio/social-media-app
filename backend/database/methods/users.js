const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(credentials) {
    const { username, password } = credentials;
    const userExists = await User.findOne({ username }).exec();
    if (userExists) {
        const res = { status: 404, message: "User already exists", success: false };
        return res;
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

        const res = { message: "Success: user has been created", user, success: true };
        return res;
    }
}

async function authorizeUser(credentials) {
    const { username, password } = credentials;
    const user = await User.findOne({ username }).populate("profile").exec();
    if (!user) {
        const res = { status: 400, message: "User does not exist", user: false, success: false };
        return res;
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ user }, process.env.SECRET, {expiresIn: "1h"});
            const res = { message: "Login was successful", user, token, success: true };
            return res;
        } else {
            const res = { status: 404, message: "Password does not match", user: false, success: false };
            return res;
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
    const userExists = await User.findById(id).exec();
    if (!userExists) {
        const res = { status: 400, message: "User does not exist", user: null, success: false };
        return res;
    }

    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(update.password, salt);
        update.password = hashedPassword;
    }

    await User.findByIdAndUpdate(id, update).exec();
    const user = await User.findById(id).populate("profile").exec();

    const res = { user, message: "Update was successful", success: true };
    return res;
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
    const userExists = await User.findById(userId).exec();

    if (!userExists) {
        const res = { status: 400, message: "User does not exist", success: false };
        return res;
    }

    await Profile.findByIdAndUpdate(userExists.profile, update).exec();
    const profile = await Profile.findById(userExists.profile).exec();

    userExists.profile = profile;

    const res = { user: userExists, message: "Update was successful", success: true };
    return res;
}

async function followProfile(userId, peerUserId, follow) {
    const userExists = await User.findById(userId).populate("profile").exec();
    const peerUserExists = await User.findById(peerUserId).populate("profile").exec();

    if (!userExists || !peerUserExists) {
        return { status: 400, message: "User does not exist", success: false };
    }

    if (follow) {
        if (!userExists.profile.following.includes(peerUserExists._id) &&
            !peerUserExists.profile.followers.includes(userExists._id)) {
            await Profile.findByIdAndUpdate(userExists.profile._id, { $push: { following: peerUserExists._id } }).exec();
            await Profile.findByIdAndUpdate(peerUserExists.profile._id, { $push: { followers: userExists._id } }).exec();
        } else {
            return { status: 404, message: "Already following user", success: false };
        }
    }

    if (!follow) {
        if (userExists.profile.following.includes(peerUserExists._id) &&
            peerUserExists.profile.followers.includes(userExists._id)) {
            await Profile.findByIdAndUpdate(userExists.profile._id, { $pull: { following: peerUserExists._id } }).exec();
            await Profile.findByIdAndUpdate(peerUserExists.profile._id, { $pull: { followers: userExists._id } }).exec();
        } else {
            return { status: 404, message: "Already not following user", success: false };
        }
    }

    const clientUser = await User.findById(userExists._id).populate("profile").exec();
    const peerUser = await User.findById(peerUserExists._id).populate("profile").exec();
    const token = jwt.sign({ user: clientUser }, process.env.SECRET, {expiresIn: "1h"});

    return { message: "Update was successful", clientUser, peerUser, success: true };
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