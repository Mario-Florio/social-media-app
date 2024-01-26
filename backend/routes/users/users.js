const express = require("express");
const users_controller = require("../../controllers/users");
const { verifyToken } = require("../../verifyToken");

const router = express.Router();

router.get("/", users_controller.read_all);

router.get("/:id", users_controller.read_one);

router.post("/", users_controller.create);

router.put("/:id", verifyToken, users_controller.update);

router.delete("/:id", verifyToken, users_controller.remove);

router.get("/:id/profile", users_controller.read_profile);

router.put("/:id/profile", verifyToken, users_controller.update_profile);

module.exports = router;