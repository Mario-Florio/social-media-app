const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, minLength: 3, required: true },
    password: { type: String, minLength: 8, required: true }
}, { timestamps: true, virtuals: true });

UserSchema.virtual("url").get(function() {
    const url = `/users/${this._id}`;
    return url;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;