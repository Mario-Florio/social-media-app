const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    bio: { type: String, maxLength: 250, default: "" },
    picture: { type: Schema.Types.ObjectId, ref: "Photo", default: null },
    coverPicture: { type: Schema.Types.ObjectId, ref: "Photo", default: null },
    forum: { type: Schema.Types.ObjectId, ref: "Forum", required: true },
    followers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "User", default: [] }
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;