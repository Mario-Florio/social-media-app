import defaultProfilePicUrl from "./imgs/default/profile-pic.jpg";
import defaultCoverPhotoUrl from "./imgs/default/cover-photo.jpg";

import jesusChristProfilePic from "./imgs/jesusChrist/profile-pic.jpg";
import jesusChristCoverPhoto from "./imgs/jesusChrist/cover-photo.jpg";

import laoziProfilePic from "./imgs/laozi/profile-pic.jpg";
import laoziCoverPhoto from "./imgs/laozi/cover-photo.jpg";

import aristotleProfilePic from "./imgs/aristotle/profile-pic.jpg";
import aristotleCoverPhoto from "./imgs/aristotle/cover-photo.jpg";

import platoProfilePic from "./imgs/plato/profile-pic.jpg";
import platoCoverPhoto from "./imgs/plato/cover-photo.jpg";

import siddharthaGuatamaProfilePic from "./imgs/siddharthaGuatama/profile-pic.jpg";
import siddharthaGuatamaCoverPhoto from "./imgs/siddharthaGuatama/cover-photo.jpg";

import carlJungProfilePic from "./imgs/carlJung/profile-pic.jpg";
import carlJungCoverPhoto from "./imgs/carlJung/cover-photo.jpg";

import charlesDarwinProfilePic from "./imgs/charlesDarwin/profile-pic.jpg";
import charlesDarwinCoverPhoto from "./imgs/charlesDarwin/cover-photo.jpg";

export const defaultProfilePic = { _id: "1", name: "Default-profilePic", url: defaultProfilePicUrl }
export const defaultCoverPhoto = { _id: "2", name: "Default-coverPhoto", url: defaultCoverPhotoUrl }

export const profilePicImages = [
    defaultProfilePic,
    { _id: "3", name: "Siddhartha Guatama-profilePic", url: siddharthaGuatamaProfilePic },
    { _id: "5", name: "Jesus Christ-profilePic", url: jesusChristProfilePic },
    { _id: "7", name: "Aristotle-profilePic", url: aristotleProfilePic },
    { _id: "9", name: "Plato-profilePic", url: platoProfilePic },
    { _id: "11", name: "Charles Darwin-profilePic", url: charlesDarwinProfilePic },
    { _id: "13", name: "Carl Jung-profilePic", url: carlJungProfilePic },
    { _id: "15", name: "Laozi-profilePic", url: laoziProfilePic }
];

export const coverPhotoImages = [
    defaultCoverPhoto,
    { _id: "4", name: "Siddhartha Guatama-coverPhoto", url: siddharthaGuatamaCoverPhoto },
    { _id: "6", name: "Jesus Christ-coverPhoto", url: jesusChristCoverPhoto },
    { _id: "8", name: "Aristotle-coverPhoto", url: aristotleCoverPhoto },
    { _id: "10", name: "Plato-coverPhoto", url: platoCoverPhoto },
    { _id: "12", name: "Charles Darwin-coverPhoto", url: charlesDarwinCoverPhoto },
    { _id: "14", name: "Carl Jung-coverPhoto", url: carlJungCoverPhoto },
    { _id: "16", name: "Laozi-coverPhoto", url: laoziCoverPhoto }
];

export const images = [ ...profilePicImages, ...coverPhotoImages ];
