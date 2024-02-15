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

async function getUsers() {
    await delay(1000);

    const users = [
        {
            _id: 1,
            username: "Jane Dough",
            profile: {
                _id: 1,
                picture: janeDoughProfilePic,
                coverPicture: janeDoughCoverPhoto,
                bio: "Hello World!",
                following: [2, 3, 4, 5, 6, 7],
                followers: [2, 3, 4, 5, 6, 7],
                forum: 1
            }
        },
        {
            _id: 2,
            username: "Jesus Christ",
            profile: {
                _id: 2,
                picture: jesusChristProfilePic,
                coverPicture: jesusChristCoverPhoto,
                bio: "Hello World!",
                following: [1, 3, 4, 5, 6, 7],
                followers: [1, 3, 4, 5, 6, 7],
                forum: 2
            }
        },
        {
            _id: 3,
            username: "Tyrion Lannister",
            profile: {
                _id: 3,
                picture: tyrionLannisterProfilePic,
                coverPicture: tyrionLannisterCoverPhoto,
                bio: "Hello World!",
                following: [1, 2, 4, 5, 6, 7],
                followers: [1, 2, 4, 5, 6, 7],
                forum: 3
            }
        },
        {
            _id: 4,
            username: "Jinx",
            profile: {
                _id: 4,
                picture: jinxProfilePic,
                coverPicture: jinxCoverPhoto,
                bio: "Hello World!",
                following: [1, 2, 3, 5, 6, 7],
                followers: [1, 2, 3, 5, 6, 7],
                forum: 4
            }
        },
        {
            _id: 5,
            username: "Nea Karlsson",
            profile: {
                _id: 5,
                picture: neaKarlssonProfilePic,
                coverPicture: neaKarlssonCoverPhoto,
                bio: "Hello World!",
                following: [1, 2, 3, 4, 6, 7],
                followers: [1, 2, 3, 4, 6, 7],
                forum: 5
            }
        },
        {
            _id: 6,
            username: "Rust Cohle",
            profile: {
                _id: 6,
                picture: rustCohleProfilePic,
                coverPicture: rustCohleCoverPhoto,
                bio: "Time is a flat circle, man",
                following: [1, 2, 3, 4, 5, 7],
                followers: [1, 2, 3, 4, 5, 7],
                forum: 6
            }
        },
        {
            _id: 7,
            username: "Ellie Williams",
            profile: {
                _id: 7,
                picture: ellieWilliamsProfilePic,
                coverPicture: ellieWilliamsCoverPhoto,
                bio: "Hello!",
                following: [1, 2, 3, 4, 5, 6],
                followers: [1, 2, 3, 4, 5, 6],
                forum: 7
            }
        }
    ];

    return users;
}

export default getUsers;

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}