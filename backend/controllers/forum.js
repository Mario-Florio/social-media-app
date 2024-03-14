const forums_dbMethods = require("../database/methods/forums");

async function read_one(req, res, next) {
    try {
        const responseBody = await forums_dbMethods.getForumById(req.params.id);
        if (!responseBody.success) {
            const { status, message, success } = responseBody;
            return res.status(status).json({ message, success });
        }
        res.json(responseBody);
    } catch (err) {
        res.status(500).json({ message: "Request unsuccesful", success: false });
    }
}

module.exports = {
    read_one
}