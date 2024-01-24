const User = require("../models/User");
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

        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();

        const res = {
            message: "Success: user has been created",
            success: true
        };
        return res;
    }
}

async function authorizeUser(credentials) {
    const { username, password } = credentials;
    const user = await User.findOne({ username }).exec();
    if (!user) {
        const res = { status: 400, message: "User does not exist", user: false };
        return res;
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ user }, process.env.SECRET, {expiresIn: "1h"});
            const res = {
                message: "Login was successful",
                user,
                token
            }
            return res;
        } else {
            const res = { status: 404, message: "Password does not match", user: false };
            return res;
        }
    }
}

async function getUsers() {
    const users = await User.find().exec();
    return users;
}

async function getUserById(id) {
    try {
        const user = await User.findById(id);
        return user;
    } catch(err) {
        return null;
    }
}

module.exports = {
    registerUser,
    authorizeUser,
    getUsers,
    getUserById
}