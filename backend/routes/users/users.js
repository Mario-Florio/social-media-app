const express = require("express");
const users_controller = require("../../controllers/users");
const { getToken } = require("../../authenticate");

const router = express.Router();

router.get("/", users_controller.read_all);

router.get("/:id", users_controller.read_one);

router.post("/", users_controller.create);

router.put("/:id", getToken, users_controller.update);

router.delete("/:id", getToken, users_controller.remove);

router.put("/:id/profile", getToken, users_controller.update_profile);

module.exports = router;