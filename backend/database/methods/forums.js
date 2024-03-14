const Forum = require("../../models/Forum");

async function getForumById(id) {
    const forum = await Forum.findById(id).exec();
    if (!forum) {
        return { status: 400, message: "Forum does not exist", success: false };
    }
    return { message : "Request successful", forum, success: true };
}

module.exports = {
    getForumById
}