import janeDoughProfilePic from "../../assets/imgs/janeDough/profile-pic.jpg";
import janeDoughCoverPhoto from "../../assets/imgs/janeDough/cover-photo.jpg";

import jesusChristProfilePic from "../../assets/imgs/jesusChrist/profile-pic.jpg";
import jesusChristCoverPhoto from "../../assets/imgs/jesusChrist/cover-photo.jpg";

import tyrionLannisterProfilePic from "../../assets/imgs/tyrionLannister/profile-pic.jpg";
import tyrionLannisterCoverPhoto from "../../assets/imgs/tyrionLannister/cover-photo.jpg";

import jinxProfilePic from "../../assets/imgs/jinx/profile-pic.jpg";
import jinxCoverPhoto from "../../assets/imgs/jinx/cover-photo.jpg";

import neaKarlssonProfilePic from "../../assets/imgs/neaKarlsson/profile-pic.jpg";
import neaKarlssonCoverPhoto from "../../assets/imgs/neaKarlsson/cover-photo.jpg";

import rustCohleProfilePic from "../../assets/imgs/rustCohle/profile-pic.jpg";
import rustCohleCoverPhoto from "../../assets/imgs/rustCohle/cover-photo.jpg";

import ellieWilliamsProfilePic from "../../assets/imgs/ellieWilliams/profile-pic.jpg";
import ellieWilliamsCoverPhoto from "../../assets/imgs/ellieWilliams/cover-photo.jpg";

export default function populateCollections() {
    populateUsersCollection();
    populatePostsCollection();
    populateForumsCollection();
    populateCommentsCollection();
    populatePhotosCollections();
    populateAlbumsCollections();
    populateImagesStorage();
}

function populateUsersCollection() {
    const users = [
        {
            _id: "1",
            username: "Jane Dough",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "1",
                picture: janeDoughProfilePic,
                coverPicture: janeDoughCoverPhoto,
                bio: "Hello World!",
                following: ["2", "3", "4", "5", "6", "7"],
                followers: ["2", "3", "4", "5", "6", "7"],
                forum: "1"
            }
        },
        {
            _id: "2",
            username: "Jesus Christ",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "2",
                picture: jesusChristProfilePic,
                coverPicture: jesusChristCoverPhoto,
                bio: "Hello World!",
                following: ["1", "3", "4", "5", "6", "7"],
                followers: ["1", "3", "4", "5", "6", "7"],
                forum: "2"
            }
        },
        {
            _id: "3",
            username: "Tyrion Lannister",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "3",
                picture: tyrionLannisterProfilePic,
                coverPicture: tyrionLannisterCoverPhoto,
                bio: "Hello World!",
                following: ["1", "2", "4", "5", "6", "7"],
                followers: ["1", "2", "4", "5", "6", "7"],
                forum: "3"
            }
        },
        {
            _id: "4",
            username: "Jinx",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "4",
                picture: jinxProfilePic,
                coverPicture: jinxCoverPhoto,
                bio: "Hello World!",
                following: ["1", "2", "3", "5", "6", "7"],
                followers: ["1", "2", "3", "5", "6", "7"],
                forum: "4"
            }
        },
        {
            _id: "5",
            username: "Nea Karlsson",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "5",
                picture: neaKarlssonProfilePic,
                coverPicture: neaKarlssonCoverPhoto,
                bio: "Hello World!",
                following: ["1", "2", "3", "4", "6", "7"],
                followers: ["1", "2", "3", "4", "6", "7"],
                forum: "5"
            }
        },
        {
            _id: "6",
            username: "Rust Cohle",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "6",
                picture: rustCohleProfilePic,
                coverPicture: rustCohleCoverPhoto,
                bio: "Time is a flat circle, man",
                following: ["1", "2", "3", "4", "5", "7"],
                followers: ["1", "2", "3", "4", "5", "7"],
                forum: "6"
            }
        },
        {
            _id: "7",
            username: "Ellie Williams",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "7",
                picture: ellieWilliamsProfilePic,
                coverPicture: ellieWilliamsCoverPhoto,
                bio: "Hello!",
                following: ["1", "2", "3", "4", "5", "6"],
                followers: ["1", "2", "3", "4", "5", "6"],
                forum: "7"
            }
        }
    ];
    
    window.localStorage.setItem("Users", JSON.stringify(users));
}

function populatePostsCollection() {
    const posts = [
        { _id: "1", user: "1", text: "Hello", likes: ["2", "3"], comments: ["2", "3", "5", "6", "11", "12", "13", "14", "15", "16"], createdAt: new Date() },
        { _id: "2", user: "1", text: "Hello", likes: ["3"], comments: ["4", "7"], createdAt: new Date() },
        { _id: "3", user: "1", text: "Hello", likes: [], comments: ["1"], createdAt: new Date() },
        { _id: "4", user: "2", text: "Hello", likes: ["1", "3"], comments: ["8", "9"], createdAt: new Date() },
        { _id: "5", user: "2", text: "Hello", likes: ["1"], comments: ["10"], createdAt: new Date() },
        { _id: "6", user: "2", text: "Hello", likes: ["3"], comments: [], createdAt: new Date() },
        { _id: "7", user: "3", text: "Hello", likes: [], comments: [], createdAt: new Date() },
        { _id: "8", user: "3", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "9", user: "3", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "11", user: "3", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() },
        { _id: "12", user: "4", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "13", user: "4", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "14", user: "4", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() },
        { _id: "15", user: "5", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "16", user: "5", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "17", user: "5", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() },
        { _id: "18", user: "6", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "19", user: "6", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "20", user: "6", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() },
        { _id: "21", user: "7", text: "Hello", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "22", user: "7", text: "Hello", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "23", user: "7", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() }
    ];

    window.localStorage.setItem("Posts", JSON.stringify(posts));
}

function populateForumsCollection() {
    const forums = [
        { _id: "1", posts: ["1", "2", "3"] },
        { _id: "2", posts: ["4", "5", "6"] },
        { _id: "3", posts: ["7", "8", "9", "10"] },
        { _id: "4", posts: ["12", "13", "14"] },
        { _id: "5", posts: ["15", "16", "17"] },
        { _id: "6", posts: ["18", "19", "20"] },
        { _id: "7", posts: ["21", "22", "23"] },
    ];

    window.localStorage.setItem("Forums", JSON.stringify(forums));
}

function populateCommentsCollection() {
    const comments = [
        { _id: "1", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "2", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "3", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "4", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "5", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "6", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "7", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "8", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "9", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "10", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "11", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "12", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "13", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "14", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "15", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "16", user: "3", post: "0", text: "Hello", createdAt: new Date() },
    ];

    window.localStorage.setItem("Comments", JSON.stringify(comments));
}

function populatePhotosCollections() {
    const photos = [
        { _id: "1", user: "1", pointer: "1", name: "Profile pic", caption: "caption skjdvbo sdv dkvj fdivn fvjd f sgj eqgj a fdjvbb fvj fv fvef vetb ioion oi nroir oir ori b oerigh i rghi gerghi epwirogh pgosdv dkvj fdivn fvjd f sgj eqgj a fdjvbb fvj fv fvef vetb ioion oi nroir oir ori b oerigh i rghi gerghi epwirogh...", createdAt: new Date() },
        { _id: "2", user: "1", pointer: "2", name: "Cover photo", caption: "caption...", createdAt: new Date() },
        { _id: "3", user: "2", pointer: "3", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "4", user: "2", pointer: "4", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "5", user: "3", pointer: "5", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "6", user: "3", pointer: "6", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "7", user: "4", pointer: "7", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "8", user: "4", pointer: "8", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "9", user: "5", pointer: "9", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "10", user: "5", pointer: "10", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "11", user: "6", pointer: "11", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "12", user: "6", pointer: "12", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "13", user: "7", pointer: "13", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "14", user: "7", pointer: "14", name: "", caption: "caption...", createdAt: new Date() },
        { _id: "15", user: "1", pointer: "15", name: "", caption: "caption...", createdAt: new Date() }
    ];
    
    window.localStorage.setItem("Photos", JSON.stringify(photos));
}

function populateAlbumsCollections() {
    const albums = [
        { _id: "1", user: "1", name: "All", photos: ["1", "2", "15"], desc: "", createdAt: new Date() },
        { _id: "2", user: "1", name: "Profile Pictures", photos: ["1"], desc: "", createdAt: new Date() },
        { _id: "3", user: "1", name: "Cover Photos", photos: ["2"], desc: "", createdAt: new Date() },
        { _id: "4", user: "2", name: "All", photos: ["3", "4"], desc: "", createdAt: new Date() },
        { _id: "5", user: "2", name: "Profile Pictures", photos: ["3"], desc: "", createdAt: new Date() },
        { _id: "6", user: "2", name: "Cover Photos", photos: ["4"], desc: "", createdAt: new Date() },
        { _id: "7", user: "3", name: "All", photos: ["5", "6"], desc: "", createdAt: new Date() },
        { _id: "8", user: "3", name: "Profile Pictures", photos: ["5"], desc: "", createdAt: new Date() },
        { _id: "9", user: "3", name: "Cover Photos", photos: ["6"], desc: "", createdAt: new Date() },
        { _id: "10", user: "4", name: "All", photos: ["7", "8"], desc: "", createdAt: new Date() },
        { _id: "11", user: "4", name: "Profile Pictures", photos: ["7"], desc: "", createdAt: new Date() },
        { _id: "12", user: "4", name: "Cover Photos", photos: ["8"], desc: "", createdAt: new Date() },
        { _id: "13", user: "5", name: "All", photos: ["9", "10"], desc: "", createdAt: new Date() },
        { _id: "14", user: "5", name: "Profile Pictures", photos: ["9"], desc: "", createdAt: new Date() },
        { _id: "15", user: "5", name: "Cover Photos", photos: ["10"], desc: "", createdAt: new Date() },
        { _id: "16", user: "6", name: "All", photos: ["11", "12"], desc: "", createdAt: new Date() },
        { _id: "17", user: "6", name: "Profile Pictures", photos: ["11"], desc: "", createdAt: new Date() },
        { _id: "18", user: "6", name: "Cover Photos", photos: ["12"], desc: "", createdAt: new Date() },
        { _id: "19", user: "7", name: "All", photos: ["13", "14"], desc: "", createdAt: new Date() },
        { _id: "20", user: "7", name: "Profile Pictures", photos: ["13"], desc: "", createdAt: new Date() },
        { _id: "21", user: "7", name: "Cover Photos", photos: ["14"], desc: "", createdAt: new Date() }
    ];

    window.localStorage.setItem("Albums", JSON.stringify(albums));
}

function populateImagesStorage() {
    const images = [
        { _id: "1", name: "1", url: janeDoughProfilePic },
        { _id: "2", name: "2", url: janeDoughCoverPhoto },
        { _id: "3", name: "3", url: jesusChristProfilePic },
        { _id: "4", name: "4", url: jesusChristCoverPhoto },
        { _id: "5", name: "5", url: tyrionLannisterProfilePic },
        { _id: "6", name: "6", url: tyrionLannisterCoverPhoto },
        { _id: "7", name: "7", url: jinxProfilePic },
        { _id: "8", name: "8", url: jinxCoverPhoto },
        { _id: "9", name: "9", url: neaKarlssonProfilePic },
        { _id: "10", name: "10", url: neaKarlssonCoverPhoto },
        { _id: "11", name: "11", url: rustCohleProfilePic },
        { _id: "12", name: "12", url: rustCohleCoverPhoto },
        { _id: "13", name: "13", url: ellieWilliamsProfilePic },
        { _id: "14", name: "14", url: ellieWilliamsCoverPhoto },
        { _id: "15", name: "15", url: ellieWilliamsCoverPhoto }
    ];

    window.localStorage.setItem("Images", JSON.stringify(images));
}
