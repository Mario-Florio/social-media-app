import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
import getPhotoUrl from "./__utils__/getPhotoUrl";
import uid from "./__utils__/uniqueId";
import validateToken from "./__utils__/validateToken";

const ms = 0;

async function getAlbumsMock(reqBody = { queryBody: {} }) {
    await delay(ms);
    const { userId } = reqBody.queryBody;

    const albums = getCollection("Albums");
    const photos = getCollection("Photos");
    const images = getCollection("Images");

    const usersAlbums = albums.filter(album => album.user === userId);

    const populatedAlbums = usersAlbums.map(album => {
        const albumPhotos = album.photos.map(albumPhotoId => {
            const [ photo ] = photos.filter(photo => photo._id === albumPhotoId);
            return photo;
        });
        album.photos = albumPhotos;
        return album;
    });

    populatedAlbums.forEach(album => {
        album.photos.forEach(photo => {
            let signedUrl;
            images.forEach(image => {
                if (image.name === photo.pointer) {
                    signedUrl = image.url;
                }
            });
            photo.url = signedUrl;
        });
    });

    return { message: "Request Successful", albums: populatedAlbums, success: true }
}

async function postAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, album } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false }

    const albums = getCollection("Albums");

    const newAlbum = {
        _id: uid(),
        user: album.user,
        name: album.name,
        desc: album.desc,
        photos: [],
        createdAt: new Date()
    }

    albums.push(newAlbum);

    window.localStorage.setItem("Albums", JSON.stringify(albums));

    return { message: "Request Successful: Album created successfully", album: newAlbum, success: true }
}

async function putAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, id, update } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false }

    const albums = getCollection("Albums");

    let albumFound = false;
    let index = 0;
    for (const album of albums) {
        if (album._id === id) {
            albumFound = true;
            break;
        }
        index++;
    }

    if (!albumFound) return { message: "Request Failed: Album does not exist", success: false };

    albums[index].name = update.name;
    albums[index].desc = update.desc;

    window.localStorage.setItem("Albums", JSON.stringify(albums));

    return { message: "Request Successful: Album created successfully", album: albums[index], success: true }
}

async function deleteAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, id } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false }

    const albums = getCollection("Albums");

    const filteredAlbums = albums.filter(album => album._id !== id);

    window.localStorage.setItem("Albums", JSON.stringify(filteredAlbums));

    return { message: "Request Successful: Album created successfully", success: true }
}

async function postPhotoMock(reqBody = {}) {
    const { albumId, formData, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false }

    const albums = getCollection("Albums");

    const [ album ] = albums.filter(album => album._id === albumId);
    if (!album) return { message: "Request Failed: Album does not exist", success: true }

    const name = formData.get("name");
    const caption = formData.get("caption");
    const image = formData.get("image")

    const photo = {
        _id: uid(),
        name,
        caption,
        pointer: "",
        url: URL.createObjectURL(image)
    }

    return { message: "Upload Successful", photo, success: true }
}

async function deletePhotoMock(reqBody = {}) {
    const { photoId, albumId, token } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request Failed: Action is forbidden", success: false }

    let albums = getCollection("Albums");
    let photos = getCollection("Photos");
    let users = getCollection("Users");

    const [ album ] = albums.filter(album => album._id === albumId);
    if (!album) return { message: "Request Failed: Album does not exist", success: false }

    if (album.name === "All") {
        const userId = album.user;

        albums = albums.map(album => {
            if (album.user === userId) {
                const filteredPhotos = album.photos.filter(photo => photo !== photoId);
                album.photos = filteredPhotos;
            }
            return album;
        });

        users = users.map(user => {
            if (user._id === userId) {
                if (user.profile.picture && user.profile.picture._id === photoId) user.profile.picture = null;
                if (user.profile.coverPicture && user.profile.coverPicture._id === photoId) user.profile.picture = null;
            }
            return user;
        });

        const [ photo ] = photos.filter(photo => photo._id === photoId);
        if (!photo) return { message: "Request Failed: Photo does not exist", success: false }

        photos = photos.filter(photo => photo._id !== photoId);
    } else {
        albums = albums.map(album => {
            if (album._id === albumId) {
                const filteredAlbumPhotos = album.photos.filter(photo => photo !== photoId);
                album.photos = filteredAlbumPhotos;
            }
            return album;
        });
    }

    window.localStorage.setItem("Users", JSON.stringify(users));
    window.localStorage.setItem("Albums", JSON.stringify(albums));
    window.localStorage.setItem("photos", JSON.stringify(photos));

    return { message: "Deletion Successful", success: true }
}

export {
    getAlbumsMock,
    postAlbumMock,
    putAlbumMock,
    deleteAlbumMock,
    postPhotoMock,
    deletePhotoMock
}