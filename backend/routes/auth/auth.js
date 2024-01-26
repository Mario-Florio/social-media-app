const express = require("express");
const auth_controller = require("../../controllers/auth");

const router = express.Router();

// login
router.post("/login", auth_controller.login);

module.exports = router;