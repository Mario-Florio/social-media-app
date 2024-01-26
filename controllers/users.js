const { registerUser, getUsers, getUserById, updateUser, deleteUser, getProfile, updateProfile } = require("../database/methods/users");
const { authenticate } = require("../verifyToken");

async function get_all(req, res, next) {
    const users = await getUsers();
    res.json({ users });
} 

async function get_one(req, res, next) {
    const user = await getUserById(req.params.id);
    res.json({ user });
}

async function post(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await registerUser(sanitizedInput);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function put(req, res, next) {
    const authenticationResBody = authenticate(req);
    if (!authenticationResBody.success) {
        const { status, message, authData } = authenticationResBody;
        return res.status(status).json({ message, authData });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const sanitizedInput = sanitizeInput(req.body);
    const isValid = validateInput(sanitizedInput);
    if (!isValid) {
        return res.status(422).json({ message: "Invalid input", success: false });
    }

    const responseBody = await updateUser(req.params.id, sanitizedInput);
    if (!responseBody.user) {
        const { status, message, user } = responseBody;
        return res.status(status).json({ message, user });
    } else {
        return res.json(responseBody);
    }
}

async function remove(req, res, next) {
    const authenticationResBody = authenticate(req);
    if (!authenticationResBody.success) {
        const { status, message, authData } = authenticationResBody;
        return res.status(status).json({ message, authData });
    }

    const responseBody = await deleteUser(req.params.id);
    if (!responseBody.success) {
        const { status, message, success } = responseBody;
        return res.status(status).json({ message, success });
    } else {
        return res.json(responseBody);
    }
}

async function get_profile(req, res, next) {
    const userId = req.params.id;
    const responseBody = await getProfile(userId);
    if (!responseBody.profile) {
        const { status, message, profile } = responseBody;
        return res.status(status).json({ message, profile });
    } else {
        return res.json(responseBody);
    }
}

async function put_profile(req, res, next) {
    const authenticationResBody = authenticate(req);
    if (!authenticationResBody.success) {
        const { status, message, authData } = authenticationResBody;
        return res.status(status).json({ message, authData });
    }

    const { bio, picture } = req.body;
    if (!bio || !picture) {
        return res.sendStatus(400);
    }

    const sanitizedInput = sanitizeInput(req.body);

    const responseBody = await updateProfile(req.params.id, sanitizedInput);
    if (!responseBody.profile) {
        const { status, message, profile } = responseBody;
        return res.status(status).json({ message, profile });
    } else {
        return res.json(responseBody);
    }
}

// UTILS
function sanitizeInput(input) {
    const sanitizedInput = {};
    for (const field in input) {
        sanitizedInput[field] = input[field].trim();
    }
    return sanitizedInput;
}

function validateInput(input) {
    if (input.password.length < 8 || input.password.length > 25) {
        return false;
    }
    return true;
}

module.exports = {
    get_all,
    get_one,
    post,
    put,
    remove,
    get_profile,
    put_profile
}
