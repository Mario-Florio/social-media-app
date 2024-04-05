const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, minLength: 3, maxLength: 25, required: true },
    password: { type: String, select: false, required: true },
    profile: { type: Schema.Types.ObjectId, ref: "Profile", required: true }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;