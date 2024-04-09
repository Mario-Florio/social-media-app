const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: { type: String, minLength: 3, maxLength: 25, required: true },
    desc: { type: String, default: "", maxLength: 250 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    photos: { type: [Schema.Types.ObjectId], ref: "Photo", default: [] }
}, { timestamps: true });

const Album = mongoose.model("Album", AlbumSchema);

module.exports = Album;