const User = require("../../models/User");
const Profile = require("../../models/Profile");
const bcrypt = require("bcryptjs");

async function populateUsers() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    for (let i = 1; i < 5; i++) {
        const user = await new User({ username: "username"+i, password: hashedPassword }).save();
        await new Profile({ user: user._id, bio: "This is a bio..." }).save();
    }
}

module.exports = populateUsers;