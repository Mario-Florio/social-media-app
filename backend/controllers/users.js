const users_dbMethods = require("../database/methods/users");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {
    const users = await users_dbMethods.getUsers();
    res.json({ users });
} 

async function read_one(req, res, next) {
    const user = await users_dbMethods.getUserById(req.params.id);
    res.json({ user });
}

async function create(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const sanitizedInput = sanitizeInput(req.body);
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
        const { status, message } = verifyTokenResBody;
        return res.status(status).json({ message });
    }
    const userId = req.params.id;
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to update this user" });
    }

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await users_dbMethods.updateUser(userId, sanitizedInput);
    if (!responseBody.user) {
        const { status, message, user } = responseBody;
        return res.status(status).json({ message, user });
    } else {
        return res.json(responseBody);
    }
}

async function remove(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message } = verifyTokenResBody;
        return res.status(status).json({ message });
    }
    const userId = req.params.id;
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to delete this user" });
    }

    const responseBody = await users_dbMethods.deleteUser(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function read_profile(req, res, next) {
    const userId = req.params.id;
    const responseBody = await users_dbMethods.getProfile(userId);
    if (!responseBody.profile) {
        const { status, message, profile } = responseBody;
        return res.status(status).json({ message, profile });
    } else {
        return res.json(responseBody);
    }
}

async function update_profile(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message } = verifyTokenResBody;
        return res.status(status).json({ message });
    }
    const userId = req.params.id;
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to update this user" });
    }

    const sanitizedInput = sanitizeInput(req.body);

    const responseBody = await users_dbMethods.updateProfile(userId, sanitizedInput);
    if (!responseBody.profile) {
        const { status, message, profile } = responseBody;
        return res.status(status).json({ message, profile });
    } else {
        return res.json(responseBody);
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
    read_profile,
    update_profile
}
