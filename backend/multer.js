const multer  = require("multer");
const crypto = require("crypto");

const randomImageName = (bytes=32) => crypto.randomBytes(bytes).toString("hex");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, randomImageName()+path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports = upload;