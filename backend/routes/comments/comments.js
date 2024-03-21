const express = require("express");
const comments_controller = require("../../controllers/comments");
const { getToken } = require("../../authenticate");

const router = express.Router();

router.get("/", comments_controller.read_all);

router.post("/", getToken, comments_controller.create);

router.put("/:id", getToken, comments_controller.update);

router.delete("/:id", getToken, comments_controller.remove);

module.exports = router;