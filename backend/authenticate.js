const jwt = require("jsonwebtoken");

function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET, (err, authData) => {
        if (err) {
            const res = {
                status: 400,
                message: err.message,
                authData,
                success: false
            }
            return res;
        } else {
            const res = {
                authData,
                message: "User successfully authorized",
                success: true
            }
            return res;
        }
    });
}

function getToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(404).json({ message: 'Action is forbidden', success: false });
    }
}

module.exports = {
    verifyToken,
    getToken
};