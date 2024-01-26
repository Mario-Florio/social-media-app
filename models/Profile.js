const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String, maxLength: 250 },
    picture: { type: String }
}, { timestamps: true, virtuals: true });

ProfileSchema.virtual("url").get(function() {
    const url = `/users/${this.user}/profile`;
    return url;
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;