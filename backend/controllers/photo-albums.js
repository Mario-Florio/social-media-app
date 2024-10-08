const photoAlbums_dbMethods = require("../database/methods/photo-albums");
const { verifyToken } = require("../globals/authenticate");

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
        return res.status(404).json({ message: "Request Failed: Action is forbidden", success: false });
    }
    
    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Request Failed: Invalid input", success: false });
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
        return res.status(400).json({ message: "Request Failed: Album does not exist", success: false });
    }
    
    const userId = album.user.toString();
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "Request Failed: Action is forbidden", success: false });
    }
    
    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Request Failed: Invalid input", success: false });
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
        return res.status(400).json({ message: "Request Failed: Album does not exist", success: false });
    }

    const userId = album.user.toString();
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "Request Failed: You are not authorized to delete this album", success: false });
    }

    const responseBody = await photoAlbums_dbMethods.deleteAlbum(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    res.json(responseBody);
}

async function create_photo(req, res, next) {
    const { user } = req.body;
    if (!user || !req.file) {
        return res.status(400).json({ message: "Request Failed: Missing fields", success: false });
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

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput, isPhotos=true);
    if (!isValid) {
        return res.status(422).json({ message: "Request Failed: Invalid input", success: false });
    }

    const data = { ...sanitizedInput, image: req.file }
    const responseBody = await photoAlbums_dbMethods.createPhoto(data, req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    res.json(responseBody);
}

async function remove_photo(req, res, next) {
    const verifyTokenResBody = verifyToken(req.token);
    if (!verifyTokenResBody.success) {
        const { status, message, success } = verifyTokenResBody;
        return res.status(status).json({ message, success });
    }

    const { album } = await photoAlbums_dbMethods.getAlbumById(req.params.id);
    if (!album) {
        return res.status(400).json({ message: "Request Failed: Album does not exist", success: false });
    }

    const userId = album.user.toString();
    const { authData } = verifyTokenResBody;
    if (authData.user._id !== userId) {
        return res.status(404).json({ message: "Request Failed: You are not authorized to delete this album", success: false });
    }

    const responseBody = await photoAlbums_dbMethods.deletePhoto(req.params.photoId, req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    }

    res.json(responseBody);
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
        (input.name.length > 25) ||
        (input.name.length < 3)) {
        return false;
    }
    if (input.desc &&
        (input.desc.length > 250)) {
        return false
    }
    if (input.caption &&
        (input.caption.length > 250)) {
        return false
    }
    return true;
}

module.exports = {
    read_all,
    create,
    update,
    remove,
    create_photo,
    remove_photo
}