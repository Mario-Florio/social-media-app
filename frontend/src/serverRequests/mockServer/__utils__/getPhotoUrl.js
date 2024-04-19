import getCollection from "./getCollection";

function getPhotoUrl(photo) {
    if (!photo) return;
    const images = getCollection("Images");

    for (const image of images) {
        if (photo.pointer === image.name) photo.url = image.url;
    }
}

export default getPhotoUrl;