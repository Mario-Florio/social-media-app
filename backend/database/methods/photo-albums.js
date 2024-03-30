const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const bucketName = process.env.BUCKET_NAME;

// crypto
const crypto = require("crypto");
const randomImageName = (bytes=32) => crypto.randomBytes(bytes).toString("hex");

// aws-s3
const s3 = require("../../s3Client");
const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getAlbums() {
    const albums = await Album.find().populate("photos").exec();

    return { message: "Request successful", albums, success: true }
}

async function getAlbumById(id) {
    const album = await Album.findById(id).populate("photos").exec();
    if (!album) {
        return { status: 400, message: "Album does not exist", success: false };
    }

    return { message: "Request successful", album, success: true };
}

async function createAlbum(data) {
    const album = await new Album(data).save();
    return { message: "Success: album has been created", album, success: true }
}

async function updateAlbum(id, update) {
    const album = await Album.findById(id).populate("photos").exec();

    if (!album) {
        return { status: 400, message: "Album does not exist", album: null };
    }

    for (const key in update) {
        if (
            key !== "_id" ||
            key !== "user" ||
            key !== "createdAt" ||
            key !== "updatedAt" ||
            key !== "photos"
        ) {
            album[key] = update[key];
        }
    }
    await album.save();

    return { success: true, message: "Update was successful", album };
}

async function deleteAlbum(id) {
    const album = await Album.findByIdAndDelete(id).exec();

    if (!album) {
        return { status: 400, message: "Album does not exist", album: null };
    }

    return { success: true, message: "Deletion was successful" };
}

async function createPhotos(data, albumId) {
    return { message: "Success: photos created", photos: [], success: true }
}

async function deletePhoto(id) {
    return { message: "Deletion successful", success: true }
}

module.exports = {
    getAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    createPhotos,
    deletePhoto
}