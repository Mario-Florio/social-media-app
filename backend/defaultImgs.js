
const defaultProfileImages = [
    { _id: "1", name: "Default-profilePic", url: "/assets/imgs/default/profile-pic.jpg" },
    { _id: "3", name: "Jane Dough-profilePic", url: "/assets/imgs/janeDough/profile-pic.jpg" },
    { _id: "5", name: "Jesus Christ-profilePic", url: "/assets/imgs/jesusChrist/profile-pic.jpg" },
    { _id: "7", name: "Tyrion Lannister-profilePic", url: "/assets/imgs/tyrionLannister/profile-pic.jpg" },
    { _id: "9", name: "Jinx-profilePic", url: "/assets/imgs/jinx/profile-pic.jpg" },
    { _id: "11", name: "Nea Karlsson-profilePic", url: "/assets/imgs/neaKarlsson/profile-pic.jpg" },
    { _id: "13", name: "Rust Cohle-profilePic", url: "/assets/imgs/rustCohle/profile-pic.jpg" },
    { _id: "15", name: "Ellie Williams-profilePic", url: "/assets/imgs/ellieWilliams/profile-pic.jpg" }
];

const defaultCoverImages = [
    { _id: "2", name: "Default-coverPhoto", url: "/assets/imgs/default/cover-photo.jpg" },
    { _id: "4", name: "Jane Dough-coverPhoto", url: "/assets/imgs/janeDough/cover-photo.jpg" },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: "/assets/imgs/jesusChrist/cover-photo.jpg" },
    { _id: "8", name: "Tyrion Lannister-coverPhoto", url: "/assets/imgs/tyrionLannister/cover-photo.jpg" },
    { _id: "10", name: "Jinx-coverPhoto", url: "/assets/imgs/jinx/cover-photo.jpg" },
    { _id: "12", name: "Nea Karlsson-coverPhoto", url: "/assets/imgs/neaKarlsson/cover-photo.jpg" },
    { _id: "14", name: "Rust Cohle-coverPhoto", url: "/assets/imgs/rustCohle/cover-photo.jpg" },
    { _id: "16", name: "Ellie Williams-coverPhoto", url: "/assets/imgs/ellieWilliams/cover-photo.jpg" }
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