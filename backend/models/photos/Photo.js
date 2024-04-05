const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    name: { type: String, default: "", maxLength: 25 },
    caption: { type: String, default: "", maxLength: 250 },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    pointer: { type: String, required: true },
    url: { type: String, default: null }
}, { timestamps: true });

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;