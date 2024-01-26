const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function authenticate(req) {
    return jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
            const res = {
                status: 400,
                message: err.message,
                authData,
                success: false
            }
            return res;
        } else {
            const { id } = req.params;
            if (authData.user._id !== id) {
                const res = {
                    status: 404,
                    message: "You are not authorized to update this user",
                    authData,
                    success: false
                }
                return res;
            } else {
                const res = {
                    authData,
                    success: true
                }
                return res;
            }
        }
    });
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(404).json({ message: 'Action is forbidden' });
    }
}

module.exports = {
    authenticate,
    verifyToken
};