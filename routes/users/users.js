const express = require("express");
const users_controller = require("../../controllers/users/users");

const router = express.Router();

router.get("/", users_controller.get);

module.exports = router;