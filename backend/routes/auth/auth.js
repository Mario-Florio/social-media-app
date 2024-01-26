const express = require("express");
const auth_controller = require("../../controllers/auth");

const router = express.Router();

router.get("/session", auth_controller.read_authData);

router.post("/login", auth_controller.login);

module.exports = router;