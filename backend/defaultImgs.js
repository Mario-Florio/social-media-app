
const defaultProfileImages = [
    { _id: "1", name: "Default-profilePic", url: "/assets/imgs/default/profile-pic.jpg" },
    { _id: "3", name: "Siddhartha Guatama-profilePic", url: "/assets/imgs/siddharthaGuatama/profile-pic.jpg" },
    { _id: "5", name: "Jesus Christ-profilePic", url: "/assets/imgs/jesusChrist/profile-pic.jpg" },
    { _id: "7", name: "Aristotle-profilePic", url: "/assets/imgs/aristotle/profile-pic.jpg" },
    { _id: "9", name: "Plato-profilePic", url: "/assets/imgs/plato/profile-pic.jpg" },
    { _id: "11", name: "Charles Darwin-profilePic", url: "/assets/imgs/charlesDarwin/profile-pic.jpg" },
    { _id: "13", name: "Carl Jung-profilePic", url: "/assets/imgs/carlJung/profile-pic.jpg" },
    { _id: "15", name: "Laozi-profilePic", url: "/assets/imgs/laozi/profile-pic.jpg" }
];

const defaultCoverImages = [
    { _id: "2", name: "Default-coverPhoto", url: "/assets/imgs/default/cover-photo.jpg" },
    { _id: "4", name: "Siddhartha Guatama-coverPhoto", url: "/assets/imgs/siddharthaGuatama/cover-photo.jpg" },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: "/assets/imgs/jesusChrist/cover-photo.jpg" },
    { _id: "8", name: "Aristotle-coverPhoto", url: "/assets/imgs/aristotle/cover-photo.jpg" },
    { _id: "10", name: "Plato-coverPhoto", url: "/assets/imgs/plato/cover-photo.jpg" },
    { _id: "12", name: "Charles Darwin-coverPhoto", url: "/assets/imgs/charlesDarwin/cover-photo.jpg" },
    { _id: "14", name: "Carl Jung-coverPhoto", url: "/assets/imgs/carlJung/cover-photo.jpg" },
    { _id: "16", name: "Laozi-coverPhoto", url: "/assets/imgs/laozi/cover-photo.jpg" }
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