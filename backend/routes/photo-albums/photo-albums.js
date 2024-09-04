const express = require("express");
const photoAlbums_controller = require("../../controllers/photo-albums");
const { getToken } = require("../../globals/authenticate");
const upload = require("../../globals/multer");

const router = express.Router();

router.get("/", photoAlbums_controller.read_all);

router.post("/", getToken, photoAlbums_controller.create);

router.put("/:id", getToken, photoAlbums_controller.update);

router.delete("/:id", getToken, photoAlbums_controller.remove);

router.post("/:id/photos", getToken, upload.single("image"), photoAlbums_controller.create_photo);

router.delete("/:id/photos/:photoId", getToken, photoAlbums_controller.remove_photo);

module.exports = router;