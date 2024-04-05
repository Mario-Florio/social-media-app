import defaultProfilePicUrl from "./imgs/default/profile-pic.jpg";
import defaultCoverPhotoUrl from "./imgs/default/cover-photo.jpg";

import janeDoughProfilePic from "./imgs/janeDough/profile-pic.jpg";
import janeDoughCoverPhoto from "./imgs/janeDough/cover-photo.jpg";

import jesusChristProfilePic from "./imgs/jesusChrist/profile-pic.jpg";
import jesusChristCoverPhoto from "./imgs/jesusChrist/cover-photo.jpg";

import tyrionLannisterProfilePic from "./imgs/tyrionLannister/profile-pic.jpg";
import tyrionLannisterCoverPhoto from "./imgs/tyrionLannister/cover-photo.jpg";

import jinxProfilePic from "./imgs/jinx/profile-pic.jpg";
import jinxCoverPhoto from "./imgs/jinx/cover-photo.jpg";

import neaKarlssonProfilePic from "./imgs/neaKarlsson/profile-pic.jpg";
import neaKarlssonCoverPhoto from "./imgs/neaKarlsson/cover-photo.jpg";

import rustCohleProfilePic from "./imgs/rustCohle/profile-pic.jpg";
import rustCohleCoverPhoto from "./imgs/rustCohle/cover-photo.jpg";

import ellieWilliamsProfilePic from "./imgs/ellieWilliams/profile-pic.jpg";
import ellieWilliamsCoverPhoto from "./imgs/ellieWilliams/cover-photo.jpg";

export const defaultProfilePic = { _id: "1", name: "Default-profilePic", url: defaultProfilePicUrl }
export const defaultCoverPhoto = { _id: "2", name: "Default-coverPhoto", url: defaultCoverPhotoUrl }

export const profilePicImages = [
    defaultProfilePic,
    { _id: "3", name: "Jane Dough-profilePic", url: janeDoughProfilePic },
    { _id: "5", name: "Jesus Christ-profilePic", url: jesusChristProfilePic },
    { _id: "7", name: "Tyrion Lannister-profilePic", url: tyrionLannisterProfilePic },
    { _id: "9", name: "Jinx-profilePic", url: jinxProfilePic },
    { _id: "11", name: "Nea Karlsson-profilePic", url: neaKarlssonProfilePic },
    { _id: "13", name: "Rust Cohle-profilePic", url: rustCohleProfilePic },
    { _id: "15", name: "Ellie Williams-profilePic", url: ellieWilliamsProfilePic }
];

export const coverPhotoImages = [
    defaultCoverPhoto,
    { _id: "4", name: "Jane Dough-coverPhoto", url: janeDoughCoverPhoto },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: jesusChristCoverPhoto },
    { _id: "8", name: "Tyrion Lannister-coverPhoto", url: tyrionLannisterCoverPhoto },
    { _id: "10", name: "Jinx-coverPhoto", url: jinxCoverPhoto },
    { _id: "12", name: "Nea Karlsson-coverPhoto", url: neaKarlssonCoverPhoto },
    { _id: "14", name: "Rust Cohle-coverPhoto", url: rustCohleCoverPhoto },
    { _id: "16", name: "Ellie Williams-coverPhoto", url: ellieWilliamsCoverPhoto }
];

export const images = [ ...profilePicImages, ...coverPhotoImages ];
