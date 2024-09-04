const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Forum = require("../../models/Forum");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Album = require("../../models/photos/Album");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const getPhotoUrl = require("./__utils__/getPhotoUrl");
const { defaultImages } = require("../../globals/defaultImgs");

const randomImageName = (bytes=32) => crypto.randomBytes(bytes).toString("hex");

async function registerUser(credentials) {
    const { username, password } = credentials;
    const userExists = await User.findOne({ username }).exec();
    if (userExists) {
        return { status: 404, message: "Request Failed: User already exists", success: false };
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const forum = await new Forum().save();
        const profile = await new Profile({ forum }).save();
        const user = await new User({
            username,
            password: hashedPassword,
            profile
        }).save();

        await new Album({ user: user._id, name: "All" }).save();
        await new Album({ user: user._id, name: "Profile Pictures" }).save();
        await new Album({ user: user._id, name: "Cover Photos" }).save();

        return { message: "Request Successful: User has been created", user, success: true };
    }
}

async function authorizeUser(credentials) {
    const { username, password } = credentials;
    const user = await User.findOne({ username })
        .select("+password")
        .populate({ path: "profile", populate: { path: "picture coverPicture" } })
        .exec();

    if (!user) {
        return { status: 400, message: "Request Failed: User does not exist", user: false, success: false };
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            user.password = "";
            const token = jwt.sign({ user }, process.env.SECRET, {expiresIn: "1h"});

            await getPhotoUrl(user.profile.picture);
            await getPhotoUrl(user.profile.coverPicture);

            const res = { message: "Login Successful", user, token, success: true };
            return res;
        } else {
            return { status: 404, message: "Request Failed: Password does not match", user: false, success: false };
        }
    }
}

async function getUsers(limit=10, page=0, search, populate) {
    const popObj = {};
    if (populate) {
        const userIds = [];
        if (populate.model === "User") {
            for (const field of populate.fields) {
                const user = await User.findById(populate._id).populate("profile").exec();
                Array.isArray(user.profile[field]) && userIds.push(...user.profile[field]);
            }
        }
        if (populate.model === "Post") {
            for (const field of populate.fields) {
                const post = await Post.findById(populate._id).exec();
                Array.isArray(post[field]) && userIds.push(...post[field]);
            }
        }
        popObj._id = { $in: userIds };
    }

    const searchObj = search ? { username: { $regex: search, $options: "i" } } : {};

    const queryObj = { ...popObj, ...searchObj };

    const users = await User.find(queryObj)
        .limit(limit)
        .skip(limit * page)
        .sort({ username: 1 })
        .populate({ path: "profile", populate: { path: "picture coverPicture" }})
        .exec();

    for (const user of users) {
        await getPhotoUrl(user.profile.picture);
        await getPhotoUrl(user.profile.coverPicture);
    }

    return users;
}

async function getUserById(id) {
    const user = await User.findById(id)
        .populate({ path: "profile", populate: { path: "picture coverPicture" } })
        .exec();
    
    if (!user) {
        return { status: 400, message: "Request Failed: User does not exist", success: false };
    }

    await getPhotoUrl(user.profile.picture);
    await getPhotoUrl(user.profile.coverPicture);

    return { message: "Request Successful", user, success: true };
}

async function updateUser(id, update) {
    const user = await User.findById(id)
        .populate({ path: "profile", populate: { path: "picture coverPicture" } })
        .exec();

    if (!user) {
        return { status: 400, message: "Request Failed: User does not exist", user: null, success: false };
    }

    await getPhotoUrl(user.profile.picture);
    await getPhotoUrl(user.profile.coverPicture);

    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(update.password, salt);
        update.password = hashedPassword;
    }

    for (const key in update) {
        if (
            key !== "_id" &&
            key !== "profile" &&
            key !== "createdAt" &&
            key !== "updatedAt"
        ) {
            user[key] = update[key];
        }
    }

    await user.save();

    return { user, message: "Update Successful", success: true };
}

async function deleteUser(id) {
    const user = await User.findById(id).exec();

    if (!user) {
        const res = { status: 400, message: "Request Failed: User does not exist", user: null, success: false };
        return res;
    }

    // 1. delete all users albums, photos, & images
    await Album.deleteMany({ user: user._id }).exec();
    const photos = await Photo.find({ user: user._id }).exec();
    for (const photo of photos) {
        await Image.deleteOne({ name: photo.pointer }).exec();
    }
    await Photo.deleteMany({ user: user._id }).exec();

    // 2. delete all refs to users comments in posts (i.e. post.comments)
    const posts = await Post.find().populate("comments").exec();
    for (const post of posts) {
        for (const comment of post.comments) {
            if (comment.user.toString() === user._id.toString()) {
                await Post.findByIdAndUpdate(post._id, { $pull: { comments: comment._id } }).exec();
            }
        }
    }

    // 3. delete all comments made by user (i.e. comment.user)
    await Comment.deleteMany({ user: user._id }).exec();

    // 4. delete all refs to user in posts (i.e. post.likes)
    await Post.updateMany({ likes: user._id }, { $pull: { likes: user._id } }).exec();

    // 5. delete all posts from Posts ref'd in users forum
    const usersProfile = await Profile.findById(user.profile).populate("forum").exec();
    const commentIdsFromDeletedPosts = []; // used in step 6
    for (const postId of usersProfile.forum.posts) {
        const post = await Post.findByIdAndDelete(postId).exec();
        commentIdsFromDeletedPosts.push(...post.comments);
    }

    // 6. delete all refs to user in forums (i.e. forums.posts)
    const forums = await Forum.find().populate("posts").exec();
    for (const forum of forums) {
        for (const post of forum.posts) {
            if (post.user.toString() === user._id.toString()) {
                await Forum.findByIdAndUpdate(forum._id, { $pull: { posts: post._id } }).exec();
            }
        }
    }
    
    // 7. delete all comments that existed on users deleted posts (i.e. user.profile.forum.posts.forEach(comment))
    for (const commentId of commentIdsFromDeletedPosts) {
        await Comment.findByIdAndDelete(commentId).exec();
    }

    // 8. delete any posts made by user
    await Post.deleteMany({ user: user._id }).exec();

    // 9. delete users forum
    await Forum.findByIdAndDelete(usersProfile.forum).exec();

    // 10. delete all refs to user in Profiles (i.e. profile.following / profile.followers)
    await Profile.updateMany({ following: user._id }, { $pull: { following: user._id } }).exec();
    await Profile.updateMany({ followers: user._id }, { $pull: { followers: user._id } }).exec();

    // 11. delete users profile
    await Profile.findByIdAndDelete(user.profile).exec();

    // 12. delete user
    await User.findByIdAndDelete(id).exec();

    return { success: true, message: "Deletion Successful" };
}

async function updateProfile(userId, update) {
    const user = await User.findById(userId).exec();

    if (!user) {
        return { status: 400, message: "Request Failed: User does not exist", success: false };
    }

    for (const key in update) {
        if (
            key === "_id" ||
            key === "forum" ||
            key === "createdAt" ||
            key === "updatedAt" ||
            key === "picture" ||
            key === "coverPicture"
        ) {
            delete update[key];
        }
    }

    const profile = await Profile.findByIdAndUpdate(user.profile, update, { new: true })
        .populate("picture coverPicture")
        .exec();

    await getPhotoUrl(profile.picture);
    await getPhotoUrl(profile.coverPicture);
    
    user.profile = profile;

    return { user, message: "Update Successful", success: true };
}

async function followProfile(userId, peerUserId, follow) {
    const user = await User.findById(userId).populate("profile").exec();
    const peerUser = await User.findById(peerUserId).populate("profile").exec();

    if (!user || !peerUser) {
        return { status: 400, message: "Request Failed: User does not exist", success: false };
    }

    if (follow) {
        if (
            !user.profile.following.includes(peerUser._id) &&
            !peerUser.profile.followers.includes(user._id)
        ) {
            const updatedUserProfile = await Profile
                .findByIdAndUpdate(user.profile._id, { $push: { following: peerUser._id } }, { new: true })
                .populate("picture coverPicture")
                .exec();

            await getPhotoUrl(updatedUserProfile.picture);
            await getPhotoUrl(updatedUserProfile.coverPicture);

            user.profile = updatedUserProfile;

            const updatedPeerUserProfile = await Profile
                .findByIdAndUpdate(peerUser.profile._id, { $push: { followers: user._id } }, { new: true })
                .populate("picture coverPicture")
                .exec();

            await getPhotoUrl(updatedPeerUserProfile.picture);
            await getPhotoUrl(updatedPeerUserProfile.coverPicture);

            peerUser.profile = updatedPeerUserProfile;
        } else {
            return { status: 404, message: "Request Failed: Already following user", success: false };
        }
    }

    if (!follow) {
        if (
            user.profile.following.includes(peerUser._id) &&
            peerUser.profile.followers.includes(user._id)
        ) {
            const updatedUserProfile = await Profile
                .findByIdAndUpdate(user.profile._id, { $pull: { following: peerUser._id } }, { new: true })
                .populate("picture coverPicture")
                .exec();

            await getPhotoUrl(updatedUserProfile.picture);
            await getPhotoUrl(updatedUserProfile.coverPicture);

            user.profile = updatedUserProfile;

            const updatedPeerUserProfile = await Profile
                .findByIdAndUpdate(peerUser.profile._id, { $pull: { followers: user._id } }, { new: true })
                .populate("picture coverPicture")
                .exec();

            await getPhotoUrl(updatedPeerUserProfile.picture);
            await getPhotoUrl(updatedPeerUserProfile.coverPicture);

            peerUser.profile = updatedPeerUserProfile;
        } else {
            return { status: 404, message: "Request Failed: Already not following user", success: false };
        }
    }

    return { message: "Update Successful", clientUser: user, peerUser, success: true };
}

async function updateProfileDefaultImg(userId, update) {
    const user = await User.findById(userId).exec();

    if (!user) {
        return { status: 400, message: "Request Failed: User does not exist", success: false };
    }

    for (const key in update) {
        if (
            key === "_id" ||
            key === "forum" ||
            key === "createdAt" ||
            key === "updatedAt" ||
            key === "bio"
        ) {
            delete update[key];
        } else {
            update[key] = await new Photo({ user: user._id, pointer: update[key], url: getDefaultUrl(update[key]) }).save();
            await Album.findOneAndUpdate({ user: user._id, name: "All" }, { $push: { photos: update[key] } });
            if (key === "picture") await Album.findOneAndUpdate({ user: user._id, name: "Profile Pictures" }, { $push: { photos: update[key] } });
            if (key === "coverPicture") await Album.findOneAndUpdate({ user: user._id, name: "Cover Photos" }, { $push: { photos: update[key] } });
        }
    }

    const profile = await Profile.findByIdAndUpdate(user.profile, update, { new: true })
        .populate("picture coverPicture")
        .exec();

    await getPhotoUrl(profile.picture);
    await getPhotoUrl(profile.coverPicture);
    
    user.profile = profile;

    return { user, message: "Update Successful", success: true };

    function getDefaultUrl(imgName) {
        for (const img of defaultImages) {
            if (imgName === img.name) {
                return img.url;
            }
        }
    }
}

module.exports = {
    registerUser,
    authorizeUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateProfile,
    followProfile,
    updateProfileDefaultImg
}