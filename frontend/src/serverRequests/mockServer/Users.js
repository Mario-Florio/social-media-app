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

setupUsersCollection();

async function getUsersMock() {
    await delay(1000);

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    return users;
}

async function getUserMock(id) {
    await delay(1000);

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    let userFound = null;
    for (const user of users) {
        if (user._id === id) {
            userFound = user;
        }
    }

    return userFound;
}

async function postUserMock(credentials) {
    await delay(1000);

    const { username, password } = credentials;

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    for (const user of users) {
        if (user.username === username) {
            throw new Error("404: User already exists");
        }
    }

    const _id = users[users.length-1]._id + 1;
    const newUser = {
        _id,
        username,
        password,
        profile: {
            _id,
            picture: "../../assets/imgs/default/profile-picture.jpg",
            coverPicture: "../../assets/imgs/default/cover-photo.jpg",
            bio: "Hello world!",
            followers: [],
            following: [],
            forum: _id
        }
    }

    users.push(newUser);
    window.localStorage.setItem("Users", JSON.stringify(users));

    return {
        message: "Success: user has been created",
        success: true
    };
}

async function putUserMock(id, update) {
    await delay(1000);

    const token = window.localStorage.getItem("token");
    if (token !== id.toString()) return "Request is forbidden";

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    let userFound = false;
    let index = 0;
    for (const user of users) {
        if (user._id === id) {
            userFound = true;
            break;
        }
        index++;
    }

    if (!userFound) return "User does not exist";

    users[index] = update;
    window.localStorage.setItem(JSON.stringify(users));

    return "Update was successful";
}

async function deleteUserMock(id) {
    await delay(1000);

    const token = window.localStorage.getItem("token");
    if (token !== id) return "Request is forbidden";

    const usersJSON = window.localStorage.getItem("Users");
    const users = JSON.parse(usersJSON);

    let userFound = false;
    let index = 0;
    for (const user of users) {
        if (user._id === id) {
            userFound = true;
            break;
        }
        index++;
    }

    if (!userFound) return "User does not exist";

    users.splice(index, 1);
    window.localStorage.setItem(JSON.stringify(users));

    return "Deletion was successful";
}

export {
    getUsersMock,
    getUserMock,
    postUserMock,
    putUserMock,
    deleteUserMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setupUsersCollection() {
    const users = [
        {
            _id: 1,
            username: "Jane Dough",
            password: "password",
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
            password: "password",
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
            password: "password",
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
            password: "password",
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
            password: "password",
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
            password: "password",
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
            password: "password",
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
    
    if (!window.localStorage.getItem("users")) {
        window.localStorage.setItem("Users", JSON.stringify(users));
    }
}
