const users_dbMethods = require("../database/methods/users");
const { verifyToken } = require("../globals/authenticate");

async function read_authData(req, res, next) {
    const responseBody = verifyToken(req.token);
    const { message, authData, success } = responseBody;
    if (!success) {
        return res.json({ message, success });
    } else {
        const { user } = await users_dbMethods.getUserById(authData.user._id);
        return res.json({ message, user, success, token: req.token });
    }
}

async function login(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const responseBody = await users_dbMethods.authorizeUser(req.body);
    if (!responseBody.user) {
        const { status, message, user, success } = responseBody;
        return res.status(status).json({ message, user, success });
    } else {
        return res.json(responseBody);
    }
}

module.exports = {
    read_authData,
    login
}