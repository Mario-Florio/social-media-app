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

export {
    populateUsers
}