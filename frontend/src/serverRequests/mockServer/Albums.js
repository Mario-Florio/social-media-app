import delay from "./__utils__/delay";
import getCollection from "./__utils__/getCollection";

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

    return { message: "Request successful", albums: populatedAlbums, success: true };
}

export {
    getAlbumsMock
}