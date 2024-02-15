const Forum = require("../../models/Forum");

async function getForumById(id) {
    try {
        const forum = await Forum.findById(id).exec();
        return forum;
    } catch(err) {
        return null;
    }
}

module.exports = {
    getForumById
}