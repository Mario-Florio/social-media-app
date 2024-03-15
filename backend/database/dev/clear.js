const connectDB = require("../connection");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

async function dropCollections(mongoServer) {
    await User.collection.drop();
    await Profile.collection.drop();
    await Forum.collection.drop();
    await Post.collection.drop();
    await Comment.collection.drop();
}

(async () => {
    await connectDB();
    await dropCollections();
})();