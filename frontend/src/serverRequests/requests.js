import { mock } from "./config";

import { getSession, postLogin } from "./server/Auth";
import { getSessionMock, postLoginMock } from "./mockServer/Auth";

import {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
    putProfile,
    putUserFollow,
    putProfileDefaultImg
} from "./server/Users";
import {
    getUsersMock,
    getUserMock,
    postUserMock,
    putUserMock,
    deleteUserMock,
    putProfileMock,
    putUserFollowMock,
    putProfileDefaultImgMock
} from "./mockServer/Users";

import { getForum } from "./server/Forums";
import { getForumMock } from "./mockServer/Forums";

import {
    getPosts,
    getPost,
    postPost,
    putPost,
    deletePost,
    putPostLike
} from "./server/Posts";
import {
    getPostsMock,
    getPostMock,
    postPostMock,
    putPostMock,
    deletePostMock,
    putPostLikeMock
} from "./mockServer/Posts";

import {
    getComments,
    postComment,
    putComment,
    deleteComment
} from "./server/Comments";
import {
    getCommentsMock,
    postCommentMock,
    putCommentMock,
    deleteCommentMock
} from "./mockServer/Comments";

import {
    getAlbums,
    postAlbum,
    putAlbum,
    deleteAlbum,
    postPhoto,
    deletePhoto
} from "./server/Albums";
import {
    getAlbumsMock,
    postAlbumMock,
    putAlbumMock,
    deleteAlbumMock,
    postPhotoMock,
    deletePhotoMock
} from "./mockServer/Albums";

const requests = {
    auth: {
        getSession: mock ? getSessionMock : getSession,
        postLogin: mock ? postLoginMock : postLogin
    },
    users: {
        getUsers: mock ? getUsersMock : getUsers,
        getUser: mock ? getUserMock : getUser,
        postUser: mock ? postUserMock : postUser,
        putUser: mock ? putUserMock : putUser,
        deleteUser: mock ? deleteUserMock : deleteUser,
        putProfile: mock ? putProfileMock : putProfile,
        putUserFollow: mock ? putUserFollowMock : putUserFollow,
        putProfileDefaultImg: mock ? putProfileDefaultImgMock : putProfileDefaultImg
    },
    forums: {
        getForum: mock ? getForumMock : getForum,
    },
    posts: {
        getPosts: mock ? getPostsMock : getPosts,
        getPost: mock ? getPostMock : getPost,
        postPost: mock ? postPostMock : postPost,
        putPost: mock ? putPostMock : putPost,
        deletePost: mock ? deletePostMock : deletePost,
        putPostLike: mock ? putPostLikeMock : putPostLike
    },
    comments: {
        getComments: mock ? getCommentsMock : getComments,
        postComment: mock ? postCommentMock : postComment,
        putComment: mock ? putCommentMock : putComment,
        deleteComment: mock ? deleteCommentMock : deleteComment
    },
    albums: {
        getAlbums: mock ? getAlbumsMock : getAlbums,
        postAlbum: mock ? postAlbumMock : postAlbum,
        putAlbum: mock ? putAlbumMock : putAlbum,
        deleteAlbum: mock ? deleteAlbumMock : deleteAlbum,
        postPhoto: mock ? postPhotoMock : postPhoto,
        deletePhoto: mock ? deletePhotoMock : deletePhoto
    }
}

// UTILS

function notSetup() {
    return { message: "Not setup", success: false };
}

export default requests;