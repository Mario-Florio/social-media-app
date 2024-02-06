import janeDoughProfilePic from "./assets/imgs/janeDough/profile-pic.jpg";
import janeDoughCoverPhoto from "./assets/imgs/janeDough/cover-photo.jpg";

import jesusChristProfilePic from "./assets/imgs/jesusChrist/profile-pic.jpg";
import jesusChristCoverPhoto from "./assets/imgs/jesusChrist/cover-photo.jpg";

import tyrionLannisterProfilePic from "./assets/imgs/tyrionLannister/profile-pic.jpg";
import tyrionLannisterCoverPhoto from "./assets/imgs/tyrionLannister/cover-photo.jpg";

export default function getData() {
    const users = [
        {
            _id: 1,
            username: "Jane Dough",
            profile: {
                _id: 1,
                pic: janeDoughProfilePic,
                coverPhoto: janeDoughCoverPhoto,
                bio: "Hello World!",
                following: [2, 3],
                followers: [2, 3],
                posts: [1, 2, 3]
            }
        },
        {
            _id: 2,
            username: "Jesus Christ",
            profile: {
                _id: 2,
                pic: jesusChristProfilePic,
                coverPhoto: jesusChristCoverPhoto,
                bio: "Hello World!",
                following: [1, 3],
                followers: [1, 3],
                posts: [4, 5, 6]
            }
        },
        {
            _id: 3,
            username: "Tyrion Lannister",
            profile: {
                _id: 3,
                pic: tyrionLannisterProfilePic,
                coverPhoto: tyrionLannisterCoverPhoto,
                bio: "Hello World!",
                following: [1, 2],
                followers: [1, 2],
                posts: [7, 8, 9, 10]
            }
        }
    ];
    
    const posts = [
        { _id: 1, user: 1, text: "Hello", likes: [2, 3], comments: [2, 3, 5, 6, 11, 12, 13, 14, 15, 16], createdAt: new Date() },
        { _id: 2, user: 1, text: "Hello", likes: [3], comments: [4, 7], createdAt: new Date() },
        { _id: 3, user: 1, text: "Hello", likes: [], comments: [1], createdAt: new Date() },
        { _id: 4, user: 2, text: "Hello", likes: [1, 3], comments: [8, 9], createdAt: new Date() },
        { _id: 5, user: 2, text: "Hello", likes: [1], comments: [10], createdAt: new Date() },
        { _id: 6, user: 2, text: "Hello", likes: [3], comments: [], createdAt: new Date() },
        { _id: 7, user: 3, text: "Hello", likes: [], comments: [], createdAt: new Date() },
        { _id: 8, user: 3, text: "Hello", likes: [1, 2], comments: [], createdAt: new Date() },
        { _id: 9, user: 3, text: "Hello", likes: [1], comments: [], createdAt: new Date() },
        { _id: 10, user: 3, text: "Hello", likes: [2], comments: [], createdAt: new Date() }
    ];

    const comments = [
        { _id: 1,  user: 1, text: "Hello" },
        { _id: 2,  user: 2, text: "Hello" },
        { _id: 3,  user: 3, text: "Hello" },
        { _id: 4,  user: 3, text: "Hello" },
        { _id: 5,  user: 1, text: "Hello" },
        { _id: 6,  user: 2, text: "Hello" },
        { _id: 7,  user: 1, text: "Hello" },
        { _id: 8,  user: 1, text: "Hello" },
        { _id: 9,  user: 2, text: "Hello" },
        { _id: 10,  user: 3, text: "Hello" },
        { _id: 11,  user: 3, text: "Hello" },
        { _id: 12,  user: 2, text: "Hello" },
        { _id: 13,  user: 1, text: "Hello" },
        { _id: 14,  user: 1, text: "Hello" },
        { _id: 15,  user: 2, text: "Hello" },
        { _id: 16,  user: 3, text: "Hello" },
    ]

    // populate users
    posts.forEach(post => {
        let userData = null;
        users.forEach(user => {
            
            if (user._id === post.user) {
                userData = user;
            }
        });
        post.user = userData;
    });



    return { users, posts, comments };
}
