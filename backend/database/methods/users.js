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
    try {
        const user = await User.findById(id).populate("profile").exec();
        return user;
    } catch(err) {
        return null;
    }
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

async function updateProfile(id, update) {
    await Profile.findByIdAndUpdate(id, update).exec();
    const profile = await Profile.findById(id).exec();

    if (!profile) {
        const res = { status: 400, message: "Profile does not exist", profile, success: false };
        return res;
    }

    const res = { profile, message: "Update was successful", success: true };
    return res;
}

module.exports = {
    registerUser,
    authorizeUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateProfile
}