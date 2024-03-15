const connectDB = require("../connection");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

const bcrypt = require("bcryptjs");

const usersData = [
    {
        username: "Jane Dough",
        password: "password",
        profile: {
            picture: "../../assets/imgs/janeDough/profile-pic.jpg",
            coverPicture: "../../assets/imgs/janeDough/cover-photo.jpg",
            bio: "Hello World!"
        }
    },
    {
        username: "Jesus Christ",
        password: "password",
        profile: {
            picture: "../../assets/imgs/jesusChrist/profile-pic.jpg",
            coverPicture: "../../assets/imgs/jesusChrist/cover-photo.jpg",
            bio: "Hello World!"
        }
    },
    {
        username: "Tyrion Lannister",
        password: "password",
        profile: {
            picture: "../../assets/imgs/tyrionLannister/profile-pic.jpg",
            coverPicture: "../../assets/imgs/tyrionLannister/cover-photo.jpg",
            bio: "Hello World!"
        }
    },
    {
        username: "Jinx",
        password: "password",
        profile: {
            picture: "../../assets/imgs/jinx/profile-pic.jpg",
            coverPicture: "../../assets/imgs/jinx/cover-photo.jpg",
            bio: "Hello World!"
        }
    },
    {
        username: "Nea Karlsson",
        password: "password",
        profile: {
            picture: "../../assets/imgs/neaKarlsson/profile-pic.jpg",
            coverPicture: "../../assets/imgs/neaKarlsson/cover-photo.jpg",
            bio: "Hello World!"
        }
    },
    {
        username: "Rust Cohle",
        password: "password",
        profile: {
            picture: "../../assets/imgs/rustCohle/profile-pic.jpg",
            coverPicture: "../../assets/imgs/rustCohle/cover-photo.jpg",
            bio: "Time is a flat circle, man"
        }
    },
    {
        username: "Ellie Williams",
        password: "password",
        profile: {
            picture: "../../assets/imgs/ellieWilliams/profile-pic.jpg",
            coverPicture: "../../assets/imgs/ellieWilliams/cover-photo.jpg",
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
    { user: "Tyrion Lannister", text: "Hello", likes: ["Jesus Christ"], comments: []  }
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

async function populate() {
    const users = [];
    const forums = [];
    for (let i = 0; i < usersData.length; i++) {
        const { username, password } = usersData[i];
        const { picture, coverPicture, bio } = usersData[i].profile;

        const forum = await new Forum().save();

        const profile = await new Profile({ picture, coverPicture, bio, forum: forum._id }).save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await new User({ username, password: hashedPassword, profile }).save();
        users.push(user);
        forums.push(forum);
    }

    // populate following/follers
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
}

(async () => {
    await connectDB();
    await populate();
})();
