import getUsers from "../databases/Users";

// Sidemenu & Post
async function populateUsers(userIds) {
    const users = await getUsers();

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
    const users = await getUsers();

    let populatedUser = null;
    users.forEach(user => {
        if (user.profile._id === Number(profileId)) {
            populatedUser = user;
        }
    });

    return populatedUser;
}

// Topbar
async function searchUsers(input) {
    const users = await getUsers();

    const results = [];
    users.forEach(user => {
        if (user.username.toLowerCase().includes(input.toLowerCase())) {
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