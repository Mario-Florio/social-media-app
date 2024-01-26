const users_dbMethods = require("../database/methods/users");

async function login(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const responseBody = await users_dbMethods.authorizeUser(req.body);
    if (!responseBody.user) {
        const { status, message, user } = responseBody;
        return res.status(status).json({ message, user });
    } else {
        return res.json(responseBody);
    }
}

module.exports = {
    login
}