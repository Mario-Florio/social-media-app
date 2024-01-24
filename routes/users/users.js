const express = require("express");
const users_controller = require("../../controllers/users");

const router = express.Router();

router.get("/", users_controller.get_all);

router.post("/", users_controller.post);

module.exports = router;