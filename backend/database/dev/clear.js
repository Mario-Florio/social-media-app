const connectDB = require("../connection");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");

const dotenv = require("dotenv");
dotenv.config();

async function dropCollections(mongoServer) {
    await User.collection.drop();
    await Profile.collection.drop();
    await Forum.collection.drop();
    await Post.collection.drop();
    await Comment.collection.drop();
    await Album.collection.drop();
    await Photo.collection.drop();
    await Image.collection.drop();
}

(async () => {
    await connectDB();
    await dropCollections();
})();