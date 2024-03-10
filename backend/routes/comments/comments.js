const express = require("express");
const comments_controller = require("../../controllers/comments");
const { getToken } = require("../../authenticate");

const router = express.Router();

router.get("/", comments_controller.read_all);

router.post("/", getToken, comments_controller.create);

module.exports = router;