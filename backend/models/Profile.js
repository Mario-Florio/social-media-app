const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    bio: { type: String, maxLength: 250, default: "" },
    picture: { type: String, default: "../../assets/imgs/default/profile-picture.jpg" },
    coverPicture: { type: String, default: "../../assets/imgs/default/cover-photo.jpg" },
    forum: { type: Schema.Types.ObjectId, ref: "Forum", required: true },
    followers: { type: [Schema.Types.ObjectId], ref: "Profile", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "Profile", default: [] }
}, { timestamps: true, virtuals: true });

ProfileSchema.virtual("url").get(function() {
    const url = `/users/${this.user}/profile`;
    return url;
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;