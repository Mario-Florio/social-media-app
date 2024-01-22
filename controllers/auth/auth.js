const { authorizeUser } = require("../../database/methods");

async function post(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const responseBody = await authorizeUser(req.body);
    if (!responseBody.user) {
        const { status, message, user } = responseBody;
        return res.status(status).json({ message, user });
    } else {
        return res.json(responseBody);
    }

}

module.exports = {
    post
}