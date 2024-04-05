const connectDB = require("../connection");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");

const bcrypt = require("bcryptjs");

const usersData = [
    {
        username: "Jane Dough",
        password: "password",
        profile: {
            picture: "1",
            coverPicture: "2",
            bio: "Hello World!"
        }
    },
    {
        username: "Jesus Christ",
        password: "password",
        profile: {
            picture: 3,
            coverPicture: 4,
            bio: "Hello World!"
        }
    },
    {
        username: "Tyrion Lannister",
        password: "password",
        profile: {
            picture: 5,
            coverPicture: 6,
            bio: "Hello World!"
        }
    },
    {
        username: "Jinx",
        password: "password",
        profile: {
            picture: 7,
            coverPicture: 8,
            bio: "Hello World!"
        }
    },
    {
        username: "Nea Karlsson",
        password: "password",
        profile: {
            picture: 9,
            coverPicture: 10,
            bio: "Hello World!"
        }
    },
    {
        username: "Rust Cohle",
        password: "password",
        profile: {
            picture: 11,
            coverPicture: 12,
            bio: "Time is a flat circle, man"
        }
    },
    {
        username: "Ellie Williams",
        password: "password",
        profile: {
            picture: 13,
            coverPicture: 14,
            bio: "Hello!"
        }
    }
];

const postsData = [
    { user: "Jane Dough", text: "Hello", likes: ["Jesus Christ", "Tyrion Lannister"], comments: [2, 3, 5, 6, 11, 12, 13, 14, 15, 16] },
    { user: "Jane Dough", text: "Hello", likes: ["Tyrion Lannister"], comments: [4, 7] },
    { user: "Jane Dough", text: "Hello", likes: [], comments: [1] },
    { user: "Jesus Christ", text: "Hello", likes: ["Jane Dough", "Tyrion Lannister"], comments: [8, 9] },
    { user: "Jesus Christ", text: "Hello", likes: ["Jane Dough"], comments: [10] },
    { user: "Jesus Christ", text: "Hello", likes: ["Tyrion Lannister"], comments: [] },
    { user: "Tyrion Lannister", text: "Hello", likes: [], comments: [] },
    { user: "Tyrion Lannister", text: "Hello", likes: ["Jane Dough", "Jesus Christ"], comments: [] },
    { user: "Tyrion Lannister", text: "Hello", likes: ["Jane Dough"], comments: [] },
    { user: "Tyrion Lannister", text: "Hello", likes: ["Jesus Christ"], comments: []  },
    { user: "Jinx", text: "Hello", likes: [], comments: [] },
    { user: "Jinx", text: "Hello", likes: [], comments: [] },
    { user: "Jinx", text: "Hello", likes: [], comments: [] },
    { user: "Nea Karlsson", text: "Hello", likes: [], comments: [] },
    { user: "Nea Karlsson", text: "Hello", likes: [], comments: [] },
    { user: "Nea Karlsson", text: "Hello", likes: [], comments: [] },
    { user: "Rust Cohle", text: "Hello", likes: [], comments: [] },
    { user: "Rust Cohle", text: "Hello", likes: [], comments: [] },
    { user: "Rust Cohle", text: "Hello", likes: [], comments: [] },
    { user: "Ellie Williams", text: "Hello", likes: [], comments: [] },
    { user: "Ellie Williams", text: "Hello", likes: [], comments: [] },
    { user: "Ellie Williams", text: "Hello", likes: [], comments: [] }
];

const commentsData = [
    { id: 1,  user: "Jane Dough", text: "Hello" },
    { id: 2,  user: "Jesus Christ", text: "Hello" },
    { id: 3,  user: "Tyrion Lannister", text: "Hello" },
    { id: 4,  user: "Tyrion Lannister", text: "Hello" },
    { id: 5,  user: "Jane Dough", text: "Hello" },
    { id: 6,  user: "Jesus Christ", text: "Hello" },
    { id: 7,  user: "Jane Dough", text: "Hello" },
    { id: 8,  user: "Jane Dough", text: "Hello" },
    { id: 9,  user: "Jesus Christ", text: "Hello" },
    { id: 10,  user: "Tyrion Lannister", text: "Hello" },
    { id: 11,  user: "Tyrion Lannister", text: "Hello" },
    { id: 12,  user: "Jesus Christ", text: "Hello" },
    { id: 13,  user: "Jane Dough", text: "Hello" },
    { id: 14,  user: "Jane Dough", text: "Hello" },
    { id: 15,  user: "Jesus Christ", text: "Hello" },
    { id: 16,  user: "Tyrion Lannister", text: "Hello" },
];

const albumsData = [
    { user: "Jane Dough", name: "All", photos: [1, 2, 15], desc: "" },
    { user: "Jane Dough", name: "Profile Pictures", photos: [1], desc: "" },
    { user: "Jane Dough", name: "Cover Photos", photos: [2], desc: "" },
    { user: "Jesus Christ", name: "All", photos: [3, 4], desc: "" },
    { user: "Jesus Christ", name: "Profile Pictures", photos: [3], desc: "" },
    { user: "Jesus Christ", name: "Cover Photos", photos: [4], desc: "" },
    { user: "Tyrion Lannister", name: "All", photos: [5, 6], desc: "" },
    { user: "Tyrion Lannister", name: "Profile Pictures", photos: [5], desc: "" },
    { user: "Tyrion Lannister", name: "Cover Photos", photos: [6], desc: "" },
    { user: "Jinx", name: "All", photos: [7, 8], desc: "" },
    { user: "Jinx", name: "Profile Pictures", photos: [7], desc: "" },
    { user: "Jinx", name: "Cover Photos", photos: [8], desc: "" },
    { user: "Nea Karlsson", name: "All", photos: [9, 10], desc: "" },
    { user: "Nea Karlsson", name: "Profile Pictures", photos: [9], desc: "" },
    { user: "Nea Karlsson", name: "Cover Photos", photos: [10], desc: "" },
    { user: "Rust Cohle", name: "All", photos: [11, 12], desc: "" },
    { user: "Rust Cohle", name: "Profile Pictures", photos: [11], desc: "" },
    { user: "Rust Cohle", name: "Cover Photos", photos: [12], desc: "" },
    { user: "Ellie Williams", name: "All", photos: [13, 14], desc: "" },
    { user: "Ellie Williams", name: "Profile Pictures", photos: [13], desc: "" },
    { user: "Ellie Williams", name: "Cover Photos", photos: [14], desc: "" }
];

const photosData = [
    { id: 1, user: "Jane Dough", pointer: "1", name: "Profile pic", caption: "caption skjdvbo sdv dkvj fdivn fvjd f sgj eqgj a fdjvbb fvj fv fvef vetb ioion oi nroir oir ori b" },
    { id: 2, user: "Jane Dough", pointer: "2", name: "Cover photo", caption: "caption..." },
    { id: 3, user: "Jesus Christ", pointer: "3", name: "", caption: "caption..." },
    { id: 4, user: "Jesus Christ", pointer: "4", name: "", caption: "caption..." },
    { id: 5, user: "Tyrion Lannister", pointer: "5", name: "", caption: "caption..." },
    { id: 6, user: "Tyrion Lannister", pointer: "6", name: "", caption: "caption..." },
    { id: 7, user: "Jinx", pointer: "7", name: "", caption: "caption..." },
    { id: 8, user: "Jinx", pointer: "8", name: "", caption: "caption..." },
    { id: 9, user: "Nea Karlsson", pointer: "9", name: "", caption: "caption..." },
    { id: 10, user: "Nea Karlsson", pointer: "10", name: "", caption: "caption..." },
    { id: 11, user: "Rust Cohle", pointer: "11", name: "", caption: "caption..." },
    { id: 12, user: "Rust Cohle", pointer: "12", name: "", caption: "caption..." },
    { id: 13, user: "Ellie Williams", pointer: "13", name: "", caption: "caption..." },
    { id: 14, user: "Ellie Williams", pointer: "14", name: "", caption: "caption..." },
    { id: 15, user: "Jane Dough", pointer: "15", name: "", caption: "caption..." }
];

const imagesData = [
    { name: "1", url: "/janeDough/profile-pic.jpg" },
    { name: "2", url: "/janeDough/cover-photo.jpg" },
    { name: "3", url: "/jesusChrist/profile-pic.jpg" },
    { name: "4", url: "/jesusChrist/cover-photo.jpg" },
    { name: "5", url: "/tyrionLannister/profile-pic.jpg" },
    { name: "6", url: "/tyrionLannister/cover-photo.jpg" },
    { name: "7", url: "/jinx/profile-pic.jpg" },
    { name: "8", url: "/jinx/cover-photo.jpg" },
    { name: "9", url: "/neaKarlsson/profile-pic.jpg" },
    { name: "10", url: "/neaKarlsson/cover-photo.jpg" },
    { name: "11", url: "/rustCohle/profile-pic.jpg" },
    { name: "12", url: "/rustCohle/cover-photo.jpg" },
    { name: "13", url: "/ellieWilliams/profile-pic.jpg" },
    { name: "14", url: "/ellieWilliams/cover-photo.jpg" },
    { name: "15", url: "/ellieWilliams/cover-photo.jpg" }
];

async function populate() {
    const users = [];
    const forums = [];
    for (let i = 0; i < usersData.length; i++) {
        const { username, password } = usersData[i];
        const { picture, coverPicture, bio } = usersData[i].profile;

        const forum = await new Forum().save();

        const profile = await new Profile({ bio, forum: forum._id }).save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await new User({ username, password: hashedPassword, profile }).save();
        users.push(user);
        forums.push(forum);
    }

    // populate following/followers
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users.length; j++) {
            if (users[i]._id.toString() !== users[j]._id.toString()) {
                users[i].profile.following.push(users[j]._id);
                users[i].profile.followers.push(users[j]._id);
                await users[i].profile.save();
            }
        }
    }

    const posts = [];
    for (let i = 0; i < postsData.length; i++) {
        let { user, text, likes, comments } = postsData[i];

        // populate users
        for (let j = 0; j < users.length; j++) {
            if (users[j].username === user) {
                user = users[j]._id;
            }
        }

        // populate comments
        for (let j = 0; j < comments.length; j++) {
            for (let x = 0; x < commentsData.length; x++) {
                if (comments[j] === commentsData[x].id) {
                    const { user, text } = commentsData[x];
                    for (let y = 0; y < users.length; y++) {
                        if (users[y].username === user) {
                            const comment = await new Comment({ user: users[y], text }).save();
                            comments[j] = comment._id;
                        }
                    }
                }
            }
        }

        // populate likes
        for (let j = 0; j < likes.length; j++) {
            for (let x = 0; x < users.length; x++) {
                if (likes[j] === users[x].username) {
                    likes[j] = users[x]._id;
                }
            }
        }

        const post = await new Post({ user, text, likes, comments }).save();
        posts.push(post);
    }

    // populate forums
    for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < users.length; j++) {
            const { user } = posts[i];
            if (users[j]._id.toString() === user._id.toString()) {
                const { forum } = users[j].profile;
                for (let x = 0; x < forums.length; x++) {
                    if (forums[x]._id.toString() === forum.toString()) {
                        forums[x].posts.push(posts[i]._id);
                        await forums[x].save();
                    }
                }
            }
        }
    }

    const photos = [];
    for (let i = 0; i < photosData.length; i++) {
        const { pointer, name, caption } = photosData[i];

        // populate user
        const [ user ] = users.filter(u => u.username === albumsData[i].user);

        const photo = new Photo({ user: user._id, pointer, name, caption });
        await photo.save();
        photos.push(photo);

        await new Image(imagesData[i]).save();
    }

    for (let i = 0; i < albumsData.length; i++) {
        const { name, desc } = albumsData[i];

        // populate user
        const [ user ] = users.filter(u => u.username === albumsData[i].user);

        // populate album photos
        const albumPhotoIds = [];
        for (let j = 0; j < albumsData[i].photos.length; j++) {
            for (let x = 0; x < photosData.length; x++) {
                if (photosData[x].id === albumsData[i].photos[j]) {
                    albumPhotoIds.push(photos[x]._id);
                }
            }
        }

        await new Album({ user: user._id, name, photos: albumPhotoIds, desc }).save();

    }

    // set profile pictures & cover pictures
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < usersData.length; j++) {
            if (users[i].username === usersData[j].username) {
                const profilePicture = await Photo.findOne({ pointer: usersData[j].profile.picture }).exec();
                const coverPicture = await Photo.findOne({ pointer: usersData[j].profile.coverPicture }).exec();
                await Profile.findByIdAndUpdate(users[i].profile._id, { picture: profilePicture, coverPicture }).exec();
            }
        }
    }
}

(async () => {
    await connectDB();
    await populate();
})();
