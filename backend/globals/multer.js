const multer  = require("multer");
const path = require("path");
const crypto = require("crypto");
const getUploadsDir = require("./getUploadsDir");

const randomImageName = (bytes=32) => crypto.randomBytes(bytes).toString("hex");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadsDir());
    },
    filename: (req, file, cb) => {
        cb(null, randomImageName()+path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports = upload;