const Image = require("../../../models/photos/Image");
const { defaultImages } = require("../../../defaultImgs");
const dotenv = require("dotenv");

dotenv.config();

async function getPhotoUrl(photo) {
    if (photo && !isDefaultImg(photo.pointer)) {
        const photoImage = await Image.findOne({ name: photo.pointer }).exec();
        photo.url = process.env.HOSTNAME+"/uploads/"+photoImage.url;
    }
}

function isDefaultImg(imgName) {
    for (const img of defaultImages) {
        if (imgName === img.name) return true;
    }
    return false;
}

module.exports = getPhotoUrl;