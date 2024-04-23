const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");
const User = require("../../models/User");
const getPhotoUrl = require("./__utils__/getPhotoUrl");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

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

    return { message: "Request Successful", albums, success: true }
}

async function getAlbumById(id) {
    const album = await Album.findById(id).populate("photos").exec();
    if (!album) {
        return { status: 400, message: "Request Failed: Album does not exist", success: false };
    }

    for (const photo of album.photos) {
        await getPhotoUrl(photo);
    }

    return { message: "Request Successful", album, success: true };
}

async function createAlbum(data) {
    if (data.name === "All" || data.name === "Profile Pictures" || data.name === "Cover Photos") {
        return { status: 404, message: "Request Forbidden: Cannot use default album names", success: false }
    }
    const album = await new Album(data).save();
    return { message: "Request Successful: Album has been created", album, success: true }
}

async function updateAlbum(id, update) {
    const album = await Album.findById(id).populate("photos").exec();
    if (album.name === "All" || album.name === "Profile Pictures" || album.name === "Cover Photos") {
        return { status: 404, message: `Request Forbidden: cannot edit "${album.name}" album`, success: false }
    }
    for (const photo of album.photos) {
        await getPhotoUrl(photo);
    }

    if (!album) {
        return { status: 400, message: "Request Failed: Album does not exist", album: null };
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

    return { success: true, message: "Update Successful", album };
}

async function deleteAlbum(id) {
    const album = await Album.findByIdAndDelete(id).exec();

    if (!album) {
        return { status: 400, message: "Request Failed: Album does not exist", album: null };
    }

    return { success: true, message: "Deletion Successful" };
}

async function createPhoto(data, albumId) {
    const album = await Album.findById(albumId).exec();

    if (!album) {
        return { status: 400, message: "Request Failed: Album does not exist", album: null };
    }

        const name = path.parse(data.image.filename).name;
        const img = await new Image({ url: "/"+data.image.filename, name }).save();

        const { images, ...photoData } = data;
        const photo = await new Photo({ ...photoData, pointer: img.name }).save();
        await getPhotoUrl(photo);

        // push to apporpriate albums
        if (album.name !== "All") {
            await Album.findOneAndUpdate({ user: data.user, name: "All" }, { $push: { photos: photo._id } }).exec();
        }
        album.photos.push(photo._id);
        await album.save();

    return { message: "Upload Successful: Photo created", photo, success: true }
}

async function deletePhoto(id, albumId) {
    const album = await Album.findByIdAndUpdate(albumId, { $pull: { photos: id } }, { new: true }).exec();

    if (album.name === "All") {
        const userAlbums = await Album.find({ user: album.user._id }).exec();
        const user = await User.findById(album.user._id).populate("profile").exec();

        if (user.profile.picture === id) {
            user.profile.picture = null;
            await user.save();
        }

        if (user.profile.coverPicture === id) {
            user.profile.coverPicture = null;
            await user.save();
        }

        for (const album of userAlbums) {
            await Album.findByIdAndUpdate(album._id, { $pull: { photos: id } }).exec();
        }

        const photo = await Photo.findByIdAndDelete(id).exec();
    
        const image = await Image.findOneAndDelete({ name: photo.pointer }).exec();
    
        if (fs.existsSync(process.env.ROOT+"/uploads/"+image.url)) {
            fs.rmSync(process.env.ROOT+"/uploads/"+image.url);
        }
    }

    return { message: "Deletion Successful", success: true }
}

module.exports = {
    getAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    createPhoto,
    deletePhoto
}