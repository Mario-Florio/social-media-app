const forums_dbMethods = require("../database/methods/forums");

async function read_one(req, res, next) {
    const forum = await forums_dbMethods.getForumById(req.params.id);
    res.json({ forum });
}

module.exports = {
    read_one
}