
const basepath = "/social-media-app/src/defaultImages/imgs/"

const defaultProfileImages = [
    { _id: "1", name: "Default-profilePic", url: `${basepath}default/profile-pic.jpg` },
    { _id: "3", name: "Siddhartha Guatama-profilePic", url: `${basepath}siddharthaGuatama/profile-pic.jpg` },
    { _id: "5", name: "Jesus Christ-profilePic", url: `${basepath}jesusChrist/profile-pic.jpg` },
    { _id: "7", name: "Aristotle-profilePic", url: `${basepath}aristotle/profile-pic.jpg` },
    { _id: "9", name: "Plato-profilePic", url: `${basepath}plato/profile-pic.jpg` },
    { _id: "11", name: "Charles Darwin-profilePic", url: `${basepath}charlesDarwin/profile-pic.jpg` },
    { _id: "13", name: "Carl Jung-profilePic", url: `${basepath}carlJung/profile-pic.jpg` },
    { _id: "15", name: "Laozi-profilePic", url: `${basepath}laozi/profile-pic.jpg` }
];

const defaultCoverImages = [
    { _id: "2", name: "Default-coverPhoto", url: `${basepath}default/cover-photo.jpg` },
    { _id: "4", name: "Siddhartha Guatama-coverPhoto", url: `${basepath}siddharthaGuatama/cover-photo.jpg` },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: `${basepath}jesusChrist/cover-photo.jpg` },
    { _id: "8", name: "Aristotle-coverPhoto", url: `${basepath}aristotle/cover-photo.jpg` },
    { _id: "10", name: "Plato-coverPhoto", url: `${basepath}plato/cover-photo.jpg` },
    { _id: "12", name: "Charles Darwin-coverPhoto", url: `${basepath}charlesDarwin/cover-photo.jpg` },
    { _id: "14", name: "Carl Jung-coverPhoto", url: `${basepath}carlJung/cover-photo.jpg` },
    { _id: "16", name: "Laozi-coverPhoto", url: `${basepath}laozi/cover-photo.jpg` }
];

const defaultImages = [
    ...defaultProfileImages,
    ...defaultCoverImages
];

module.exports = {
    defaultProfileImages,
    defaultCoverImages,
    defaultImages
};