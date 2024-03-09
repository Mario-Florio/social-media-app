const users_dbMethods = require("../database/methods/users");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {
    const users = await users_dbMethods.getUsers();
    res.json({ message: "Request successful", users, success: true });
} 

async function read_one(req, res, next) {
    const user = await users_dbMethods.getUserById(req.params.id);
    res.json({ message: "Request successful", user, success: true });
}

async function create(req, res, next) {
    const { username, password } = req.body.credentials;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const sanitizedInput = sanitizeInput(req.body.credentials);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await users_dbMethods.registerUser(sanitizedInput);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function update(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }
    const userId = req.params.id;
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to update this user", success });
    }

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await users_dbMethods.updateUser(userId, sanitizedInput);
    if (!responseBody.user) {
        const { status, message, user } = responseBody;
        return res.status(status).json({ message, user, success });
    } else {
        return res.json(responseBody);
    }
}

async function remove(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }
    const userId = req.params.id;
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to delete this user", success });
    }

    const responseBody = await users_dbMethods.deleteUser(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function update_profile(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }
    const userId = req.params.id;
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to update this user", success });
    }

    const sanitizedInput = sanitizeInput(req.body);

    const user = await users_dbMethods.getUserById(userId);
    const { profile } = user;
    const responseBody = await users_dbMethods.updateProfile(profile._id, sanitizedInput);
    if (!responseBody.profile) {
        const { status, message, profile, success } = responseBody;
        return res.status(status).json({ message, profile, success });
    } else {
        return res.json(responseBody);
    }
}

async function follow_profile(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }

    const { userId, follow } = req.body;
    const peerId = req.params.id;

    const responseBody = await users_dbMethods.followProfile(userId, peerId, follow);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        res.json(responseBody);
    }
}

// UTILS
function sanitizeInput(input) {
    const sanitizedInput = {};
    for (const field in input) {
        sanitizedInput[field] = input[field].trim();
    }
    return sanitizedInput;
}

function validateInput(input) {
    if (input.password &&
        (input.password.length < 8 || input.password.length > 25)) {
        return false;
    }
    return true;
}

module.exports = {
    read_all,
    read_one,
    create,
    update,
    remove,
    update_profile,
    follow_profile
}
