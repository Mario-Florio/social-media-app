import populateCollections from "../mockServer/populateCollections";

import { getSession, postLogin } from "../server/Auth";
import { getSessionMock, postLoginMock } from "../mockServer/Auth";

import {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
    putUserFollow
} from "../server/Users";
import {
    getUsersMock,
    getUserMock,
    postUserMock,
    putUserMock,
    deleteUserMock,
    putUserFollowMock
} from "../mockServer/Users";

import { getForum } from "../server/Forums";
import { getForumMock } from "../mockServer/Forums";

import {
    getPosts,
    getPost,
    postPost,
    putPost,
    deletePost
} from "../server/Posts";
import {
    getPostsMock,
    getPostMock,
    postPostMock,
    putPostMock,
    deletePostMock,
    putPostLikeMock
} from "../mockServer/Posts";

import { getComments, postComment } from "../mockServer/Comments";

let mock = false;
let resetCollections = false;

const notSetup = () => {
    console.log("Not setup");
    return { message: "", comments: [], success: false };
}

resetCollections && populateCollections();

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
        putProfile: mock ? notSetup : notSetup,
        putUserFollow: mock ? putUserFollowMock : putUserFollow
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
        putPostLike: mock ? putPostLikeMock :notSetup
    },
    comments: {
        getComments: mock ? getComments : notSetup,
        postComment: mock ? postComment : notSetup
    }
}

export default requests;