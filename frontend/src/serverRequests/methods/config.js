import fetchSession from "../server/Auth";
import fetchMockSession from "../mockServer/Auth";

import fetchUsers from "../server/Users";
import fetchMockUsers from "../mockServer/Users";

import fetchForum from "../server/Forums";
import fetchMockForum from "../mockServer/Forums";

import fetchPosts from "../server/Posts";
import fetchMockPosts from "../mockServer/Posts";

let mock = false;

const requests = {
    getSession: mock ? fetchMockSession : fetchSession,
    getUsers: mock ? fetchMockUsers : fetchUsers,
    getForum: mock ? fetchMockForum : fetchForum,
    getPosts: mock ? fetchMockPosts : fetchPosts
}

export default requests;