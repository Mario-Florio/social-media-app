const Post = require("../../models/Post");
const Forum = require("../../models/Forum");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Photo = require("../../models/photos/Photo");
const Image = require("../../models/photos/Image");
const getPhotoUrl = require("./__utils__/getPhotoUrl");

async function createPost(data, forumId) {
    const post = await new Post(data).save();
    await Forum.findByIdAndUpdate(forumId, { $push: { posts: post } }).exec();
    const user = await User.findById(post.user)
        .populate({ path: "profile", populate: { path: "picture coverPicture" } })
        .exec();

    post.user = user;

    await getPhotoUrl(post.user.profile.picture);
    await getPhotoUrl(post.user.profile.coverPicture);

    const res = { message: "Success: post has been created", post, success: true };
    return res;
}

async function getPosts(limit=10, page=0, userId, timeline) {
    let postIds = [];
    if (userId) {
        const user = await User.findById(userId).populate({ path: "profile", populate: { path: "forum" } }).exec();
        if (timeline) {
            for (const followerId of user.profile.following) {
                const follower = await User.findById(followerId).populate({ path: "profile", populate: { path: "forum" } }).exec();
                postIds.push(...follower.profile.forum.posts);
            }
        }
        postIds.push(...user.profile.forum.posts);
    }
    const queryObj = userId ? { _id: { $in: postIds } } : {};

    const posts = await Post.find(queryObj)
        .limit(limit)
        .skip(limit * page)
        .sort({ createdAt: -1 })
        .populate({ path: "user", populate: { path: "profile", populate: { path: "picture coverPicture" } } })
        .exec();

    for (const post of posts) {
        await getPhotoUrl(post.user.profile.picture);
        await getPhotoUrl(post.user.profile.coverPicture);
    }

    return posts;
}

async function getPostById(id) {
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile", populate: { path: "picture coverPicture" } } })
        .exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", success: false };
    }

    await getPhotoUrl(post.user.profile.picture);
    await getPhotoUrl(post.user.profile.coverPicture);
    
    return { message: "Request successful", post, success: true };
}

async function updatePost(id, update) {
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile", populate: { path: "picture coverPicture" } } })
        .exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", post: null };
    }

    for (const key in update) {
        if (
            key !== "_id" ||
            key !== "user" ||
            key !== "createdAt" ||
            key !== "updatedAt" ||
            key !== "comments" ||
            key !== "likes"
        ) {
            post[key] = update[key];
        }
    }
    await post.save();

    await getPhotoUrl(post.user.profile.picture);
    await getPhotoUrl(post.user.profile.coverPicture);

    return { success: true, message: "Update was successful", post };
}

async function deletePost(id) {
    const post = await Post.findByIdAndDelete(id).exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", post: null };
    }

    for (const commentId of post.comments) {
        await Comment.findByIdAndDelete(commentId).exec();
    }

    const forums = await Forum.find().exec();
    for (const forum of forums) {
        if (forum.posts.includes(post._id)) {
            await Forum.findByIdAndUpdate(forum._id, {
                $pullAll: {
                    posts: [post._id]
                }
            });
        }
    }

    return { success: true, message: "Deletion was successful" };
}

async function likePost(id, userId) {
    const post = await Post.findById(id)
        .populate({ path: "user", populate: { path: "profile", populate: { path: "picture coverPicture" } } })
        .exec();

    if (!post) {
        return { status: 400, message: "Post does not exist", success: false };
    }

    if (post.likes.includes(userId)) {
        const filteredLikes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
        post.likes = filteredLikes;
        await post.save();
    } else {
        post.likes.push(userId);
        await post.save();
    }

    await getPhotoUrl(post.user.profile.picture);
    await getPhotoUrl(post.user.profile.coverPicture);

    return { message: "Update successful", post, success: true };
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost
}