const express = require("express");
const forums_controller = require("../../controllers/forum");

const router = express.Router();

router.get("/:id", forums_controller.read_one);

module.exports = router;