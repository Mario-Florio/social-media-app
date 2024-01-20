const express = require("express");
const auth_controller = require("../../controllers/auth/auth");

const router = express.Router();

// login
router.post("/login", auth_controller.post);

module.exports = router;