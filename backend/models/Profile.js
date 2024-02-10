const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    bio: { type: String, maxLength: 250 },
    picture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    posts: { type: [Schema.Types.ObjectId], ref: "Post", default: [] },
    followers: { type: [Schema.Types.ObjectId], ref: "Profile", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "Profile", default: [] }
}, { timestamps: true, virtuals: true });

ProfileSchema.virtual("url").get(function() {
    const url = `/users/${this.user}/profile`;
    return url;
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;