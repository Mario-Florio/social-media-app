const comments_dbMethods = require("../database/methods/comments");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {
    try {
        const comments = await comments_dbMethods.getComments();
        res.json({ message: "Request successful", comments, success: true });
    } catch (err) {
        res.status(500).json({ message: "Request unsuccessful", success: false });
    }
}

async function create(req, res, next) {
    try {
        const { postId } = req.body;
        const { user, text } = req.body.comment;
        if (!user || !text || !postId) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }
    
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        
        const userId = user;
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "Action is forbidden", success: false });
        }
    
        const sanitizedInput = sanitizeInput(req.body.comment);
        const isValid = validateInput(sanitizedInput);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input", success: false });
        }
    
        const responseBody = await comments_dbMethods.createComment(postId, sanitizedInput);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
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
    if (input.text &&
        (input.text.length < 3 || input.text.length > 250)) {
        return false;
    }
    return true;
}

module.exports = {
    read_all,
    create
}