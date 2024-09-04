const posts_dbMethods = require("../database/methods/posts");
const { verifyToken } = require("../globals/authenticate");

async function read_all(req, res, next) {
    try {
        const timeline = req.query.timeline === "true" ? true : false;
        const userId = req.query.userId && req.query.userId;
        const page = req.query.page && parseInt(req.query.page, 10);
        const limit = req.query.limit && parseInt(req.query.limit, 10);

        const posts = await posts_dbMethods.getPosts(limit, page, userId, timeline);
        res.json({ message: "Request Successful", posts, success: true });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
    }
}

async function read_one(req, res, next) {
    try {
        const responseBody = await posts_dbMethods.getPostById(req.params.id);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }
        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
    }
}

async function create(req, res, next) {
    try {
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
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "Request Failed: Action is forbidden", success: false });
        }
        
        const sanitizedInput = sanitizeInput(req.body.post);
        const isValid = validateInput(sanitizedInput);
        if (!isValid) {
            return res.status(422).json({ message: "Request Failed: Invalid input", success: false });
        }
    
        const responseBody = await posts_dbMethods.createPost(sanitizedInput, req.body.forum);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        return res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
    }
}

async function update(req, res, next) {
    try {    
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
        const { post } = await posts_dbMethods.getPostById(req.params.id);
        if (!post) {
            return res.status(400).json({ message: "Request Failed: Post does not exist", success: false });
        }
    
        const userId = post.user._id.toString();
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "Request Failed: You are not authorized to delete this post", success: false });
        }
    
        const sanitizedInput = sanitizeInput(req.body);
        const isValid = validateInput(sanitizedInput);
        if (!isValid) {
            return res.status(422).json({ message: "Request Failed: Invalid input", success: false });
        }
    
        const responseBody = await posts_dbMethods.updatePost(req.params.id, sanitizedInput);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }
        
        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
    }
}

async function remove(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
    
        const { post } = await posts_dbMethods.getPostById(req.params.id);
        if (!post) {
            return res.status(400).json({ message: "Request Failed: Post does not exist", success: false });
        }
    
        const userId = post.user._id.toString();
        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "Request Failed: You are not authorized to delete this post", success: false });
        }
    
        const responseBody = await posts_dbMethods.deletePost(req.params.id);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
    }
}

async function like_post(req, res, next) {
    try {
        const verifyTokenResBody = verifyToken(req.token);
        if (!verifyTokenResBody.success) {
            const { status, message, success } = verifyTokenResBody;
            return res.status(status).json({ message, success });
        }
    
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Request Failed: Missing fields", success: false });
        }

        const { authData } = verifyTokenResBody;
        if (authData.user._id !== userId) {
            return res.status(404).json({ message: "Request Failed: You are not authorized to delete this post", success: false });
        }
    
        const id = req.params.id;
        const responseBody = await posts_dbMethods.likePost(id, userId);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }

        res.json(responseBody);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Request Failed", success: false });
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
    remove,
    like_post
}