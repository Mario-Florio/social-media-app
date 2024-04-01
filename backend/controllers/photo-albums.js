const photoAlbums_dbMethods = require("../database/methods/photo-albums");
const { verifyToken } = require("../authenticate");

async function read_all(req, res, next) {

    const userId = req.query.userId && req.query.userId;

    const responseBody = await photoAlbums_dbMethods.getAlbums(userId);
    res.json(responseBody);
}

async function create(req, res, next) {
    const { user, name } = req.body;
    if (!user || !name) {
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
        return res.status(404).json({ message: "Action is forbidden", success: false });
    }
    
    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await photoAlbums_dbMethods.createAlbum(sanitizedInput);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    return res.json(responseBody);
}

async function update(req, res, next) {
    const { name } = req.body;
    if (!name) {
        return res.sendStatus(400);
    }

    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }

    const { album } = await photoAlbums_dbMethods.getAlbumById(req.params.id);
    if (!album) {
        return res.status(400).json({ message: "Album does not exist", success: false });
    }
    
    const userId = album.user.toString();
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "Action is forbidden", success: false });
    }
    
    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await photoAlbums_dbMethods.updateAlbum(req.params.id, sanitizedInput);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    return res.json(responseBody);
}

async function remove(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }

    const { album } = await photoAlbums_dbMethods.getAlbumById(req.params.id);
    if (!album) {
        return res.status(400).json({ message: "Album does not exist", success: false });
    }

    const userId = album.user.toString();
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "You are not authorized to delete this album", success: false });
    }

    const responseBody = await photoAlbums_dbMethods.deleteAlbum(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    res.json(responseBody);
}

async function create_photos(req, res, next) {
    res.json({ message: "Request successful", photo: {}, success: true });
}

async function remove_photo(req, res, next) {
    res.json({ message: "Request successful", success: true });
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
    if (input.name &&
        (input.name.length > 25)) {
        return false;
    }
    if (input.desc &&
        (input.desc.length > 250)) {
        return false
    }
    return true;
}

module.exports = {
    read_all,
    create,
    update,
    remove,
    create_photos,
    remove_photo
}