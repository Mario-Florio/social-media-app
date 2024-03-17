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
        { _id: "10", user: "3", text: "Hello", likes: ["2"], comments: [], createdAt: new Date() }
    ];

    window.localStorage.setItem("Posts", JSON.stringify(posts));
}

function populateForumsCollection() {
    const forums = [
        { _id: "1", posts: ["1", "2", "3"] },
        { _id: "2", posts: ["4", "5", "6"] },
        { _id: "3", posts: ["7", "8", "9", "10"] },
        { _id: "4", posts: [] },
        { _id: "5", posts: [] },
        { _id: "6", posts: [] },
        { _id: "7", posts: [] },
    ];

    window.localStorage.setItem("Forums", JSON.stringify(forums));
}

function populateCommentsCollection() {
    const comments = [
        { _id: "1",  user: "1", post: "0", text: "Hello" },
        { _id: "2",  user: "2", post: "0", text: "Hello" },
        { _id: "3",  user: "3", post: "0", text: "Hello" },
        { _id: "4",  user: "3", post: "0", text: "Hello" },
        { _id: "5",  user: "1", post: "0", text: "Hello" },
        { _id: "6",  user: "2", post: "0", text: "Hello" },
        { _id: "7",  user: "1", post: "0", text: "Hello" },
        { _id: "8",  user: "1", post: "0", text: "Hello" },
        { _id: "9",  user: "2", post: "0", text: "Hello" },
        { _id: "10",  user: "3", post: "0", text: "Hello" },
        { _id: "11",  user: "3", post: "0", text: "Hello" },
        { _id: "12",  user: "2", post: "0", text: "Hello" },
        { _id: "13",  user: "1", post: "0", text: "Hello" },
        { _id: "14",  user: "1", post: "0", text: "Hello" },
        { _id: "15",  user: "2", post: "0", text: "Hello" },
        { _id: "16",  user: "3", post: "0", text: "Hello" },
    ];

    window.localStorage.setItem("Comments", JSON.stringify(comments));
}

// UTILS
function uid() {
    const uid = Date.now().toString(36) +
        Math.random().toString(36).substring(2).padStart(12, 0);
        
    return uid;
}
