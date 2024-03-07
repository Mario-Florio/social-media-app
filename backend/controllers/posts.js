const posts_dbMethods = require("../database/methods/posts");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {
    const posts = await posts_dbMethods.getPosts();
    res.json({ message: "Request successful", posts, success: true });
}

async function read_one(req, res, next) {
    const post = await posts_dbMethods.getPostById(req.params.id);
    res.json({ message: "Request successful", post, success: true });
}

async function create(req, res, next) {
    const { user, text } = req.body.post;
    if (!user || !text) {
        return res.sendStatus(400);
    }

    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }
    const userId = user;
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to create posts for this user", success });
    }
    
    const sanitizedInput = sanitizeInput(req.body.post);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await posts_dbMethods.createPost(sanitizedInput, req.body.forum);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function update(req, res, next) {
    const { text } = req.body;
    if (!text) {
        return res.sendStatus(400);
    }

    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }
    const post = await posts_dbMethods.getPostById(req.params.id);
    const userId = post.user._id.toString();
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to delete this post", success });
    }

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await posts_dbMethods.updatePost(req.params.id, sanitizedInput);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
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
    const post = await posts_dbMethods.getPostById(req.params.id);
    const userId = post.user._id.toString();
    const { authData, success } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to delete this post", success });
    }

    const responseBody = await posts_dbMethods.deletePost(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
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
    if (input.text &&
        (input.text.length < 3 || input.text.length > 250)) {
        return false;
    }
    return true;
}

module.exports = {
    read_all,
    read_one,
    create,
    update,
    remove
}