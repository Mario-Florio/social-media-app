const express = require("express");
const photoAlbums_controller = require("../../controllers/photo-albums");
const { getToken } = require("../../authenticate");

// multer
const multer  = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", photoAlbums_controller.read_all);

router.post("/", getToken, photoAlbums_controller.create);

router.put("/:id", getToken, photoAlbums_controller.update);

router.delete("/:id", getToken, photoAlbums_controller.remove);

router.post("/:id/photos", getToken, upload.array("photos", 6), photoAlbums_controller.create_photos);

router.delete("/:id/photos/:photoId", getToken, photoAlbums_controller.remove_photo);

module.exports = router;