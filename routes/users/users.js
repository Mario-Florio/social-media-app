const express = require("express");
const users_controller = require("../../controllers/users");

const router = express.Router();

router.post("/", users_controller.post);

module.exports = router;