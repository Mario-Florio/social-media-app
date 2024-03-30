const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    name: { type: String, default: "", maxLength: 25 },
    caption: { type: String, default: "", maxLength: 250 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pointer: { type: String, required: true }
}, { timestamps: true });

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;