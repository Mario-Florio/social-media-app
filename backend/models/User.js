const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, minLength: 3, maxLength: 25, required: true },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: "Profile", required: true }
}, { timestamps: true, virtuals: true });

UserSchema.virtual("url").get(function() {
    const url = `/users/${this._id}`;
    return url;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;