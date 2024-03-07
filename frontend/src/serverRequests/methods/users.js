import requests from "./config";

const { getUsers } = requests.users;

// Sidemenu & Post
async function populateUsers(userIds) {
    const { users } = await getUsers();

    const populatedUsers = [];
    userIds.forEach(id => {
        users.forEach(user => {
            if (user._id === id) {
                populatedUsers.push(user);
            }
        });
    });

    return populatedUsers;
}

// Profile
async function populateProfileUser(profileId) {
    const { users } = await getUsers();

    let populatedUser = null;
    users.forEach(user => {
        if (user.profile._id.toString() === profileId) {
            populatedUser = user;
        }
    });

    return populatedUser;
}

// Topbar
async function searchUsers(input) {
    if (input.length === 0) return [];
    const { users } = await getUsers();

    const results = [];
    users.forEach(user => {
        if (user.username.toLowerCase().includes(input.toLowerCase().trim())) {
            results.push(user);
        }
    });
    
    return results;
}

export {
    populateUsers,
    populateProfileUser,
    searchUsers
}