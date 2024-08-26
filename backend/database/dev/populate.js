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
        username: "Siddhartha Guatama",
        password: "password",
        profile: {
            picture: "1",
            coverPicture: "2",
            bio: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."
        }
    },
    {
        username: "Jesus Christ",
        password: "password",
        profile: {
            picture: 3,
            coverPicture: 4,
            bio: "I am the way and the truth and the life. No one comes to the Father except through me."
        }
    },
    {
        username: "Aristotle",
        password: "password",
        profile: {
            picture: 5,
            coverPicture: 6,
            bio: "Happiness does not consist in pastimes and amusements but in virtuous activities."
        }
    },
    {
        username: "Plato",
        password: "password",
        profile: {
            picture: 7,
            coverPicture: 8,
            bio: "Reality is created by the mind, we can change our reality by changing our mind."
        }
    },
    {
        username: "Charles Darwin",
        password: "password",
        profile: {
            picture: 9,
            coverPicture: 10,
            bio: "It is not the strongest of the species that survives, not the most intelligent that survives. It is the one that is the most adaptable to change."
        }
    },
    {
        username: "Carl Jung",
        password: "password",
        profile: {
            picture: 11,
            coverPicture: 12,
            bio: "Until you make the unconscious conscious, it will direct your life and you will call it fate."
        }
    },
    {
        username: "Laozi",
        password: "password",
        profile: {
            picture: 13,
            coverPicture: 14,
            bio: "Simplicity, patience, compassion. These three are your greatest treasures."
        }
    }
];

const postsData = [
    { user: "Siddhartha Guatama", text: "However many holy words you read, however many you speak, what good will they do you if you do not act on upon them?", likes: ["Jesus Christ", "Aristotle"], comments: [2, 3, 5, 6, 11, 12, 13, 14, 15, 16] },
    { user: "Siddhartha Guatama", text: "All that we are is the result of what we have thought: it is founded on our thoughts and made up of our thoughts. If a man speak or act with an evil thought, suffering follows him as the wheel follows the hoof of the beast that draws the wagon.", likes: ["Plato", "Aristotle"], comments: [4, 7] },
    { user: "Siddhartha Guatama", text: "Doubt everything. Find your own light.", likes: [], comments: [1] },
    { user: "Jesus Christ", text: "As you wish that others would do to you, do so to them.", likes: ["Siddhartha Guatama", "Aristotle"], comments: [8, 9] },
    { user: "Jesus Christ", text: "You are the light of the world. A city set on a hill cannot be hidden. Nor do people light a lamp and put it under a basket, but on a stand, and it gives light to all in the house.", likes: ["Siddhartha Guatama"], comments: [10] },
    { user: "Jesus Christ", text: "Blessed are the pure in heart, for they shall see God.", likes: ["Aristotle"], comments: [] },
    { user: "Aristotle", text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution; it represents the wise choice of many alternatives - choice, not chance, determines your destiny.", likes: [], comments: [] },
    { user: "Aristotle", text: "Happiness is a quality of the soul...not a function of one's material circumstances.", likes: ["Siddhartha Guatama", "Jesus Christ"], comments: [] },
    { user: "Aristotle", text: "Be a free thinker and don't accept everything you hear as truth. Be critical and evaluate what you believe in.", likes: ["Siddhartha Guatama"], comments: [] },
    { user: "Aristotle", text: "The most important relationship we can all have is the one you have with yourself, the most important journey you can take is one of self-discovery. To know yourself, you must spend time with yourself, you must not be afraid to be alone.", likes: ["Siddhartha Guatama"], comments: []  },
    { user: "Plato", text: "The right question is usually more important than the right answer.", likes: [], comments: [] },
    { user: "Plato", text: "The first and the best victory is to conquer self.", likes: ["Siddhartha Guatama"], comments: [] },
    { user: "Plato", text: "The one who learns and learns and doesn't practice is like the one who plows and plows and never plants.", likes: [], comments: [] },
    { user: "Charles Darwin", text: "We must, however, acknowledge, as it seems to me, that man with all his noble qualities... still bears in his bodily frame the indelible stamp of his lowly origin.", likes: [], comments: [] },
    { user: "Charles Darwin", text: "The mystery of the beginning of all things is insoluble by us; and I for one must be content to remain an agnostic.", likes: [], comments: [] },
    { user: "Charles Darwin", text: "The highest possible stage in moral culture is when we recognize that we ought to control our thoughts.", likes: [], comments: [] },
    { user: "Carl Jung", text: "The privilege of a lifetime is to become who you truly are.", likes: [], comments: [] },
    { user: "Carl Jung", text: "The most terrifying thing is to accept oneself completely.", likes: [], comments: [] },
    { user: "Carl Jung", text: "No tree, it is said, can grow to heaven unless its roots reach down to hell.", likes: [], comments: [] },
    { user: "Laozi", text: "The journey of a thousand miles begins with a single step.", likes: [], comments: [] },
    { user: "Laozi", text: "Life is a series of natural and spontaneous changes. Don't resist them; that only creates sorrow. Let reality be reality. Let things flow naturally forward in whatever way they like.", likes: [], comments: [] },
    { user: "Laozi", text: "Nature does not hurry, yet everything is accomplished.", likes: [], comments: [] }
];

const commentsData = [
    { id: 1,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 2,  user: "Jesus Christ", text: "Hello" },
    { id: 3,  user: "Aristotle", text: "Hello" },
    { id: 4,  user: "Aristotle", text: "Hello" },
    { id: 5,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 6,  user: "Jesus Christ", text: "Hello" },
    { id: 7,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 8,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 9,  user: "Jesus Christ", text: "Hello" },
    { id: 10,  user: "Aristotle", text: "Hello" },
    { id: 11,  user: "Aristotle", text: "Hello" },
    { id: 12,  user: "Jesus Christ", text: "Hello" },
    { id: 13,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 14,  user: "Siddhartha Guatama", text: "Hello" },
    { id: 15,  user: "Jesus Christ", text: "Hello" },
    { id: 16,  user: "Aristotle", text: "Hello" },
];

const albumsData = [
    { user: "Siddhartha Guatama", name: "All", photos: [1, 2], desc: "" },
    { user: "Siddhartha Guatama", name: "Profile Pictures", photos: [1], desc: "" },
    { user: "Siddhartha Guatama", name: "Cover Photos", photos: [2], desc: "" },
    { user: "Jesus Christ", name: "All", photos: [3, 4], desc: "" },
    { user: "Jesus Christ", name: "Profile Pictures", photos: [3], desc: "" },
    { user: "Jesus Christ", name: "Cover Photos", photos: [4], desc: "" },
    { user: "Aristotle", name: "All", photos: [5, 6], desc: "" },
    { user: "Aristotle", name: "Profile Pictures", photos: [5], desc: "" },
    { user: "Aristotle", name: "Cover Photos", photos: [6], desc: "" },
    { user: "Plato", name: "All", photos: [7, 8], desc: "" },
    { user: "Plato", name: "Profile Pictures", photos: [7], desc: "" },
    { user: "Plato", name: "Cover Photos", photos: [8], desc: "" },
    { user: "Charles Darwin", name: "All", photos: [9, 10], desc: "" },
    { user: "Charles Darwin", name: "Profile Pictures", photos: [9], desc: "" },
    { user: "Charles Darwin", name: "Cover Photos", photos: [10], desc: "" },
    { user: "Carl Jung", name: "All", photos: [11, 12], desc: "" },
    { user: "Carl Jung", name: "Profile Pictures", photos: [11], desc: "" },
    { user: "Carl Jung", name: "Cover Photos", photos: [12], desc: "" },
    { user: "Laozi", name: "All", photos: [13, 14], desc: "" },
    { user: "Laozi", name: "Profile Pictures", photos: [13], desc: "" },
    { user: "Laozi", name: "Cover Photos", photos: [14], desc: "" }
];

const photosData = [
    { id: 1, user: "Siddhartha Guatama", pointer: "1", name: "", caption: "" },
    { id: 2, user: "Siddhartha Guatama", pointer: "2", name: "", caption: "" },
    { id: 3, user: "Jesus Christ", pointer: "3", name: "", caption: "" },
    { id: 4, user: "Jesus Christ", pointer: "4", name: "", caption: "" },
    { id: 5, user: "Aristotle", pointer: "5", name: "", caption: "" },
    { id: 6, user: "Aristotle", pointer: "6", name: "", caption: "There must be an eternal circular motion and this is confirmed by the fixed stars which are moved by the eternal actual substance that's purely actual." },
    { id: 7, user: "Plato", pointer: "7", name: "", caption: "" },
    { id: 8, user: "Plato", pointer: "8", name: "", caption: "\"Behold! human beings living in a underground den, which has a mouth open towards the light and reaching all along the den... what he saw before was an illusion... \" - Socrates" },
    { id: 9, user: "Charles Darwin", pointer: "9", name: "", caption: "" },
    { id: 10, user: "Charles Darwin", pointer: "10", name: "", caption: "Whilst Man, however well-behaved, At best is but a monkey shaved!" },
    { id: 11, user: "Carl Jung", pointer: "11", name: "", caption: "" },
    { id: 12, user: "Carl Jung", pointer: "12", name: "", caption: "My speech is imperfect. Not because I want to shine with words, but out of the impossibility of finding those words, I speak in images. With nothing else can I express the words from the depths." },
    { id: 13, user: "Laozi", pointer: "13", name: "", caption: "" },
    { id: 14, user: "Laozi", pointer: "14", name: "", caption: "All things carry yin and embrace yang. They reach harmony by blending with the vital breath." }
];

const imagesData = [
    { name: "1", url: "/siddharthaGuatama/profile-pic.jpg" },
    { name: "2", url: "/siddharthaGuatama/cover-photo.jpg" },
    { name: "3", url: "/jesusChrist/profile-pic.jpg" },
    { name: "4", url: "/jesusChrist/cover-photo.jpg" },
    { name: "5", url: "/aristotle/profile-pic.jpg" },
    { name: "6", url: "/aristotle/cover-photo.jpg" },
    { name: "7", url: "/plato/profile-pic.jpg" },
    { name: "8", url: "/plato/cover-photo.jpg" },
    { name: "9", url: "/charlesDarwin/profile-pic.jpg" },
    { name: "10", url: "/charlesDarwin/cover-photo.jpg" },
    { name: "11", url: "/carlJung/profile-pic.jpg" },
    { name: "12", url: "/carlJung/cover-photo.jpg" },
    { name: "13", url: "/laozi/profile-pic.jpg" },
    { name: "14", url: "/laozi/cover-photo.jpg" },
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
