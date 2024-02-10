import janeDoughProfilePic from "./assets/imgs/janeDough/profile-pic.jpg";
import janeDoughCoverPhoto from "./assets/imgs/janeDough/cover-photo.jpg";

import jesusChristProfilePic from "./assets/imgs/jesusChrist/profile-pic.jpg";
import jesusChristCoverPhoto from "./assets/imgs/jesusChrist/cover-photo.jpg";

import tyrionLannisterProfilePic from "./assets/imgs/tyrionLannister/profile-pic.jpg";
import tyrionLannisterCoverPhoto from "./assets/imgs/tyrionLannister/cover-photo.jpg";

import jinxProfilePic from "./assets/imgs/jinx/profile-pic.jpg";
import jinxCoverPhoto from "./assets/imgs/jinx/cover-photo.jpg";

import neaKarlssonProfilePic from "./assets/imgs/neaKarlsson/profile-pic.jpg";
import neaKarlssonCoverPhoto from "./assets/imgs/neaKarlsson/cover-photo.jpg";

import rustCohleProfilePic from "./assets/imgs/rustCohle/profile-pic.jpg";
import rustCohleCoverPhoto from "./assets/imgs/rustCohle/cover-photo.jpg";

import ellieWilliamsProfilePic from "./assets/imgs/ellieWilliams/profile-pic.jpg";
import ellieWilliamsCoverPhoto from "./assets/imgs/ellieWilliams/cover-photo.jpg";

export default function getData() {
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
                posts: [1, 2, 3]
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
                posts: [4, 5, 6]
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
                posts: [7, 8, 9, 10]
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
                posts: []
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
                posts: []
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
                posts: []
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
                posts: []
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

// Sidemenu
function getFollowingData(user) {
    const { users } = getData();

    let followingData = [];
    user.profile.following.forEach(a => {
        users.forEach(b => {
            if (a === b._id) {
                followingData.push(b);
            }
        });
    });

    return followingData;
}

// Topbar
function searchUsers(input) {
    const { users } = getData();

    const results = [];
    users.forEach(user => {
        if (user.username.toLowerCase().includes(input.toLowerCase())) {
            results.push(user);
        }
    });
    
    return results;
}

// Post
function getLikes(post) {
    const { users } = getData();

    let likes = [];
    post.likes.forEach(like => {
        users.forEach(user => {
            if (user._id === like) {
                likes.push(user);
            }
        });
    });

    return likes;
}

// Post Page
function getPost(id) {
    const { posts } = getData();

    let returnPost = null;
    posts.forEach(post => {
        if (post._id.toString() === id) {
            returnPost = post;
        }
    });
    
    return returnPost;
}

// Comments Section
function getComments(post) {
    const { comments, users } = getData();

    const commentsArr = [];

    post.comments.forEach(postComment => {
        comments.forEach(comment => {
            if (comment._id === postComment) {
                commentsArr.push(comment);
            }
        });
    });

    populateUsers(commentsArr);

    return commentsArr;

    function populateUsers(comments) {
        comments.forEach(comment => {
            let userData = null;
            users.forEach(user => {
                if (user._id === comment.user) {
                    userData = user;
                }
            });
            comment.user = userData;
        });
    }
}

// Profile
function getProfileUser(id) {
    const { users, posts } = getData();

    let profileUser = null;
    users.forEach(user => {
        if (user.profile._id.toString() === id) {
            profileUser = user;
        }
    });

    populatePosts(profileUser);

    return profileUser;

    function populatePosts(user) {
        const postsData = [];
        user.profile.posts.forEach(userPost => {
            posts.forEach(post => {
                if (post._id === userPost) {
                    postsData.push(post);
                }
            });
        });
        user.profile.posts = postsData;
    }
}

export {
    getFollowingData,
    searchUsers,
    getLikes,
    getPost,
    getComments,
    getProfileUser
}
