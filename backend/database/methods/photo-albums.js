const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");
const getPhotoUrl = require("./__utils__/getPhotoUrl");

async function getAlbums(userId) {
    const queryObj = {};
    if (userId) {
        queryObj.user = userId;
    }

    const albums = await Album.find(queryObj).populate("photos").exec();

    for (const album of albums) {
        for (const photo of album.photos) {
            await getPhotoUrl(photo);
        }
    } 

    return { message: "Request successful", albums, success: true }
}

async function getAlbumById(id) {
    const album = await Album.findById(id).populate("photos").exec();
    if (!album) {
        return { status: 400, message: "Album does not exist", success: false };
    }

    for (const photo of album.photos) {
        await getPhotoUrl(photo);
    }

    return { message: "Request successful", album, success: true };
}

async function createAlbum(data) {
    const album = await new Album(data).save();
    return { message: "Success: album has been created", album, success: true }
}

async function updateAlbum(id, update) {
    const album = await Album.findById(id).populate("photos").exec();
    for (const photo of album.photos) {
        await getPhotoUrl(photo);
    }

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
    const album = Album.findById(albumId).exec();

    if (!album) {
        return { status: 400, message: "Album does not exist", album: null };
    }

    const photos = [];
    for (const image of data.images) {
        const { images, ...photoData } = data;
        const photo = await new Photo({ ...photoData, pointer: image.filename }).save();
        const img = await new Image({ url: image.filename, name: photo.pointer }).save();
        photo.url = img.url;
        photos.push(photo);
    }

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