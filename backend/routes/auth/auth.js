const express = require("express");
const auth_controller = require("../../controllers/auth");
const { getToken } = require("../../authenticate");

const router = express.Router();

router.get("/session", getToken, auth_controller.read_authData);

router.post("/login", auth_controller.login);

module.exports = router;