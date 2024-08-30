
const defaultProfileImages = [
    { _id: "1", name: "Default-profilePic", url: "/src/defaultImages/imgs/default/profile-pic.jpg" },
    { _id: "3", name: "Siddhartha Guatama-profilePic", url: "/src/defaultImages/imgs/siddharthaGuatama/profile-pic.jpg" },
    { _id: "5", name: "Jesus Christ-profilePic", url: "/src/defaultImages/imgs/jesusChrist/profile-pic.jpg" },
    { _id: "7", name: "Aristotle-profilePic", url: "/src/defaultImages/imgs/aristotle/profile-pic.jpg" },
    { _id: "9", name: "Plato-profilePic", url: "/src/defaultImages/imgs/plato/profile-pic.jpg" },
    { _id: "11", name: "Charles Darwin-profilePic", url: "/src/defaultImages/imgs/charlesDarwin/profile-pic.jpg" },
    { _id: "13", name: "Carl Jung-profilePic", url: "/src/defaultImages/imgs/carlJung/profile-pic.jpg" },
    { _id: "15", name: "Laozi-profilePic", url: "/src/defaultImages/imgs/laozi/profile-pic.jpg" }
];

const defaultCoverImages = [
    { _id: "2", name: "Default-coverPhoto", url: "/src/defaultImages/imgs/default/cover-photo.jpg" },
    { _id: "4", name: "Siddhartha Guatama-coverPhoto", url: "/src/defaultImages/imgs/siddharthaGuatama/cover-photo.jpg" },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: "/src/defaultImages/imgs/jesusChrist/cover-photo.jpg" },
    { _id: "8", name: "Aristotle-coverPhoto", url: "/src/defaultImages/imgs/aristotle/cover-photo.jpg" },
    { _id: "10", name: "Plato-coverPhoto", url: "/src/defaultImages/imgs/plato/cover-photo.jpg" },
    { _id: "12", name: "Charles Darwin-coverPhoto", url: "/src/defaultImages/imgs/charlesDarwin/cover-photo.jpg" },
    { _id: "14", name: "Carl Jung-coverPhoto", url: "/src/defaultImages/imgs/carlJung/cover-photo.jpg" },
    { _id: "16", name: "Laozi-coverPhoto", url: "/src/defaultImages/imgs/laozi/cover-photo.jpg" }
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