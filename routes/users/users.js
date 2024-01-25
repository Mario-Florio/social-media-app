const express = require("express");
const users_controller = require("../../controllers/users");
const { verifyToken } = require("../../verifyToken");

const router = express.Router();

router.get("/", users_controller.get_all);

router.get("/:id", users_controller.get_one);

router.post("/", users_controller.post);

router.put("/:id", verifyToken, users_controller.put);

router.delete("/:id", verifyToken, users_controller.remove);

module.exports = router;