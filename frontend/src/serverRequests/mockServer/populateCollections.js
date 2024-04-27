
import { images } from "../../defaultImages/defaultImages";

export default function populateCollections() {
    populateUsersCollection();
    populatePostsCollection();
    populateForumsCollection();
    populateCommentsCollection();
    populatePhotosCollections();
    populateAlbumsCollections();
    populateImagesCollection();
}

function populateUsersCollection() {
    const users = [
        {
            _id: "1",
            username: "Siddhartha Guatama",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "1",
                picture: {
                    _id: "1",
                    user: "1",
                    pointer: "Siddhartha Guatama-profilePic",
                    name: "Profile pic",
                    caption: "",
                    url: "",
                    createdAt: new Date()
                },
                coverPicture: { _id: "2", user: "1", pointer: "Siddhartha Guatama-coverPhoto", name: "Cover photo", caption: "caption...", url: "", createdAt: new Date() },
                bio: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.",
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
                picture: { _id: "3", user: "2", pointer: "Jesus Christ-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "4", user: "2", pointer: "Jesus Christ-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "I am the way and the truth and the life. No one comes to the Father except through me.",
                following: ["1", "3", "4", "5", "6", "7"],
                followers: ["1", "3", "4", "5", "6", "7"],
                forum: "2"
            }
        },
        {
            _id: "3",
            username: "Aristotle",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "3",
                picture: { _id: "5", user: "3", pointer: "Aristotle-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "6", user: "3", pointer: "Aristotle-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "Happiness does not consist in pastimes and amusements but in virtuous activities.",
                following: ["1", "2", "4", "5", "6", "7"],
                followers: ["1", "2", "4", "5", "6", "7"],
                forum: "3"
            }
        },
        {
            _id: "4",
            username: "Plato",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "4",
                picture: { _id: "7", user: "4", pointer: "Plato-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "8", user: "4", pointer: "Plato-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "Reality is created by the mind, we can change our reality by changing our mind.",
                following: ["1", "2", "3", "5", "6", "7"],
                followers: ["1", "2", "3", "5", "6", "7"],
                forum: "4"
            }
        },
        {
            _id: "5",
            username: "Charles Darwin",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "5",
                picture: { _id: "9", user: "5", pointer: "Charles Darwin-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "10", user: "5", pointer: "Charles Darwin-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "It is not the strongest of the species that survives, not the most intelligent that survives. It is the one that is the most adaptable to change.",
                following: ["1", "2", "3", "4", "6", "7"],
                followers: ["1", "2", "3", "4", "6", "7"],
                forum: "5"
            }
        },
        {
            _id: "6",
            username: "Carl Jung",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "6",
                picture: { _id: "11", user: "6", pointer: "Carl Jung-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "12", user: "6", pointer: "Carl Jung-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
                following: ["1", "2", "3", "4", "5", "7"],
                followers: ["1", "2", "3", "4", "5", "7"],
                forum: "6"
            }
        },
        {
            _id: "7",
            username: "Laozi",
            password: "password",
            createdAt: new Date(),
            profile: {
                _id: "7",
                picture: { _id: "13", user: "7", pointer: "Laozi-profilePic", name: "", caption: "caption...", url: "", createdAt: new Date() },
                coverPicture: { _id: "14", user: "7", pointer: "Laozi-coverPhoto", name: "", caption: "caption...", url: "", createdAt: new Date() },
                bio: "Simplicity, patience, compassion. These three are your greatest treasures.",
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
        { _id: "1", user: "1", text: "However many holy words you read, however many you speak, what good will they do you if you do not act on upon them?", likes: ["2", "3"], comments: ["2", "3", "5", "6", "11", "12", "13", "14", "15", "16"], createdAt: new Date() },
        { _id: "2", user: "1", text: "All that we are is the result of what we have thought: it is founded on our thoughts and made up of our thoughts. If a man speak or act with an evil thought, suffering follows him as the wheel follows the hoof of the beast that draws the wagon.... If a man speak or act with a good thought, happiness follows him like a shadow that never leaves him.", likes: ["4", "3"], comments: ["4", "7"], createdAt: new Date() },
        { _id: "3", user: "1", text: "Doubt everything. Find your own light.", likes: [], comments: ["1"], createdAt: new Date() },
        { _id: "4", user: "2", text: "As you wish that others would do to you, do so to them.", likes: ["1", "3"], comments: ["8", "9"], createdAt: new Date() },
        { _id: "5", user: "2", text: "You are the light of the world. A city set on a hill cannot be hidden. Nor do people light a lamp and put it under a basket, but on a stand, and it gives light to all in the house.", likes: ["1"], comments: ["10"], createdAt: new Date() },
        { _id: "6", user: "2", text: "Blessed are the pure in heart, for they shall see God.", likes: ["3"], comments: [], createdAt: new Date() },
        { _id: "7", user: "3", text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution; it represents the wise choice of many alternatives - choice, not chance, determines your destiny.", likes: [], comments: [], createdAt: new Date() },
        { _id: "8", user: "3", text: "Happiness is a quality of the soul...not a function of one's material circumstances.", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "9", user: "3", text: "Be a free thinker and don't accept everything you hear as truth. Be critical and evaluate what you believe in.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "11", user: "3", text: "The most important relationship we can all have is the one you have with yourself, the most important journey you can take is one of self-discovery. To know yourself, you must spend time with yourself, you must not be afraid to be alone. Knowing yourself is the beginning of all wisdom.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "12", user: "4", text: "The right question is usually more important than the right answer.", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "13", user: "4", text: "The first and the best victory is to conquer self.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "14", user: "4", text: "The one who learns and learns and doesn't practice is like the one who plows and plows and never plants.", likes: ["2"], comments: [], createdAt: new Date() },
        { _id: "15", user: "5", text: "We must, however, acknowledge, as it seems to me, that man with all his noble qualities... still bears in his bodily frame the indelible stamp of his lowly origin.", likes: ["6"], comments: [], createdAt: new Date() },
        { _id: "16", user: "5", text: "The mystery of the beginning of all things is insoluble by us; and I for one must be content to remain an agnostic.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "17", user: "5", text: "The highest possible stage in moral culture is when we recognize that we ought to control our thoughts.", likes: [], comments: [], createdAt: new Date() },
        { _id: "18", user: "6", text: "The privilege of a lifetime is to become who you truly are.", likes: [], comments: [], createdAt: new Date() },
        { _id: "19", user: "6", text: "The most terrifying thing is to accept oneself completely.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "20", user: "6", text: "No tree, it is said, can grow to heaven unless its roots reach down to hell.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "21", user: "7", text: "The journey of a thousand miles begins with a single step.", likes: ["1", "2"], comments: [], createdAt: new Date() },
        { _id: "22", user: "7", text: "Life is a series of natural and spontaneous changes. Don't resist them; that only creates sorrow. Let reality be reality. Let things flow naturally forward in whatever way they like.", likes: ["1"], comments: [], createdAt: new Date() },
        { _id: "23", user: "7", text: "Nature does not hurry, yet everything is accomplished.", likes: ["2"], comments: [], createdAt: new Date() }
    ];

    window.localStorage.setItem("Posts", JSON.stringify(posts));
}

function populateForumsCollection() {
    const forums = [
        { _id: "1", posts: ["1", "2", "3"] },
        { _id: "2", posts: ["4", "5", "6"] },
        { _id: "3", posts: ["7", "8", "9", "10"] },
        { _id: "4", posts: ["12", "13", "14"] },
        { _id: "5", posts: ["15", "16", "17"] },
        { _id: "6", posts: ["18", "19", "20"] },
        { _id: "7", posts: ["21", "22", "23"] },
    ];

    window.localStorage.setItem("Forums", JSON.stringify(forums));
}

function populateCommentsCollection() {
    const comments = [
        { _id: "1", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "2", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "3", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "4", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "5", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "6", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "7", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "8", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "9", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "10", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "11", user: "3", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "12", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "13", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "14", user: "1", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "15", user: "2", post: "0", text: "Hello", createdAt: new Date() },
        { _id: "16", user: "3", post: "0", text: "Hello", createdAt: new Date() },
    ];

    window.localStorage.setItem("Comments", JSON.stringify(comments));
}

function populatePhotosCollections() {
    const photos = [
        { _id: "1", user: "1", pointer: "Siddhartha Guatama-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "2", user: "1", pointer: "Siddhartha Guatama-coverPhoto", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "3", user: "2", pointer: "Jesus Christ-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "4", user: "2", pointer: "Jesus Christ-coverPhoto", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "5", user: "3", pointer: "Aristotle-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "6", user: "3", pointer: "Aristotle-coverPhoto", name: "", caption: "There must be an eternal circular motion and this is confirmed by the fixed stars which are moved by the eternal actual substance that's purely actual.", url: "", createdAt: new Date() },
        { _id: "7", user: "4", pointer: "Plato-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "8", user: "4", pointer: "Plato-coverPhoto", name: "", caption: "\"Behold! human beings living in a underground den, which has a mouth open towards the light and reaching all along the den... what he saw before was an illusion... \" - Socrates", url: "", createdAt: new Date() },
        { _id: "9", user: "5", pointer: "Charles Darwin-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "10", user: "5", pointer: "Charles Darwin-coverPhoto", name: "", caption: "Whilst Man, however well-behaved, At best is but a monkey shaved!", url: "", createdAt: new Date() },
        { _id: "11", user: "6", pointer: "Carl Jung-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "12", user: "6", pointer: "Carl Jung-coverPhoto", name: "", caption: "My speech is imperfect. Not because I want to shine with words, but out of the impossibility of finding those words, I speak in images. With nothing else can I express the words from the depths.", url: "", createdAt: new Date() },
        { _id: "13", user: "7", pointer: "Laozi-profilePic", name: "", caption: "", url: "", createdAt: new Date() },
        { _id: "14", user: "7", pointer: "Laozi-coverPhoto", name: "", caption: "All things carry yin and embrace yang. They reach harmony by blending with the vital breath.", url: "", createdAt: new Date() }
    ];
    
    window.localStorage.setItem("Photos", JSON.stringify(photos));
}

function populateAlbumsCollections() {
    const albums = [
        { _id: "1", user: "1", name: "All", photos: ["1", "2"], desc: "", createdAt: new Date() },
        { _id: "2", user: "1", name: "Profile Pictures", photos: ["1"], desc: "", createdAt: new Date() },
        { _id: "3", user: "1", name: "Cover Photos", photos: ["2"], desc: "", createdAt: new Date() },
        { _id: "4", user: "2", name: "All", photos: ["3", "4"], desc: "", createdAt: new Date() },
        { _id: "5", user: "2", name: "Profile Pictures", photos: ["3"], desc: "", createdAt: new Date() },
        { _id: "6", user: "2", name: "Cover Photos", photos: ["4"], desc: "", createdAt: new Date() },
        { _id: "7", user: "3", name: "All", photos: ["5", "6"], desc: "", createdAt: new Date() },
        { _id: "8", user: "3", name: "Profile Pictures", photos: ["5"], desc: "", createdAt: new Date() },
        { _id: "9", user: "3", name: "Cover Photos", photos: ["6"], desc: "", createdAt: new Date() },
        { _id: "10", user: "4", name: "All", photos: ["7", "8"], desc: "", createdAt: new Date() },
        { _id: "11", user: "4", name: "Profile Pictures", photos: ["7"], desc: "", createdAt: new Date() },
        { _id: "12", user: "4", name: "Cover Photos", photos: ["8"], desc: "", createdAt: new Date() },
        { _id: "13", user: "5", name: "All", photos: ["9", "10"], desc: "", createdAt: new Date() },
        { _id: "14", user: "5", name: "Profile Pictures", photos: ["9"], desc: "", createdAt: new Date() },
        { _id: "15", user: "5", name: "Cover Photos", photos: ["10"], desc: "", createdAt: new Date() },
        { _id: "16", user: "6", name: "All", photos: ["11", "12"], desc: "", createdAt: new Date() },
        { _id: "17", user: "6", name: "Profile Pictures", photos: ["11"], desc: "", createdAt: new Date() },
        { _id: "18", user: "6", name: "Cover Photos", photos: ["12"], desc: "", createdAt: new Date() },
        { _id: "19", user: "7", name: "All", photos: ["13", "14"], desc: "", createdAt: new Date() },
        { _id: "20", user: "7", name: "Profile Pictures", photos: ["13"], desc: "", createdAt: new Date() },
        { _id: "21", user: "7", name: "Cover Photos", photos: ["14"], desc: "", createdAt: new Date() }
    ];

    window.localStorage.setItem("Albums", JSON.stringify(albums));
}

function populateImagesCollection() {
    window.localStorage.setItem("Images", JSON.stringify(images));
}
