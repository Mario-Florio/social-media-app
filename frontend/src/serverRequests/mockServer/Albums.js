import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";
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

    return { message: "Request successful", albums: populatedAlbums, success: true }
}

async function postAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, album } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false }

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

    return { message: "Album created successfully", album: newAlbum, success: true }
}

async function putAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, id, update } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false }

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

    if (!albumFound) return { message: "Album does not exist", success: false };

    albums[index].name = update.name;
    albums[index].desc = update.desc;

    window.localStorage.setItem("Albums", JSON.stringify(albums));

    return { message: "Album created successfully", album: albums[index], success: true }
}

async function deleteAlbumMock(reqBody = {}) {
    await delay(ms);
    const { token, id } = reqBody;

    const tokenIsValid = validateToken(token);
    if (!tokenIsValid) return { message: "Request is forbidden", success: false }

    const albums = getCollection("Albums");

    const filteredAlbums = albums.filter(album => album._id !== id);

    window.localStorage.setItem("Albums", JSON.stringify(filteredAlbums));

    return { message: "Album created successfully", success: true }
}

export {
    getAlbumsMock,
    postAlbumMock,
    putAlbumMock,
    deleteAlbumMock
}