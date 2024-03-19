const users_dbMethods = require("../database/methods/users");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {
    try {
        const page = req.query.page && parseInt(req.query.page, 10);
        const limit = req.query.limit && parseInt(req.query.limit, 10);
        const search = req.query.search;

        const users = await users_dbMethods.getUsers(limit, page, search);
        res.json({ message: "Request successful", users, success: true });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
} 

async function read_one(req, res, next) {
    try {
        const responseBody = await users_dbMethods.getUserById(req.params.id);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }
        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function create(req, res, next) {
    try {
        const { credentials } = req.body;
        if (!credentials) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }
        const { username, password } = req.body.credentials;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing fields", success: false });
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
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function update(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        const userId = req.params.id;
        const { authData, success } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "You are not authorized to update this user", success: false });
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
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function remove(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        const userId = req.params.id;
        const { authData, success } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "You are not authorized to delete this user", success: false });
        }
    
        const responseBody = await users_dbMethods.deleteUser(req.params.id);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function update_profile(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        const userId = req.params.id;
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "You are not authorized to update this user", success: false });
        }
    
        const sanitizedInput = sanitizeInput(req.body);
        const isValid = validateInput(sanitizedInput);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input", success: false });
        }
    
        const responseBody = await users_dbMethods.updateProfile(userId, sanitizedInput);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function follow_profile(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        const { userId } = req.body;
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "You are not authorized to update this user", success: false });
        }
    
        const { follow } = req.body;
        const peerId = req.params.id;
        const responseBody = await users_dbMethods.followProfile(userId, peerId, follow);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request unsuccessful", success: false });
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
    if (input.bio && input.bio.length > 250) {
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
