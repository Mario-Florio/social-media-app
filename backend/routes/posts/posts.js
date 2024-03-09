const express = require("express");
const posts_controller = require("../../controllers/posts");
const { getToken } = require("../../authenticate");

const router = express.Router();

router.get("/", posts_controller.read_all);

router.get("/:id", posts_controller.read_one);

router.post("/", getToken, posts_controller.create);

router.put("/:id", getToken, posts_controller.update);

router.delete("/:id", getToken, posts_controller.remove);

router.put("/:id/like", getToken, posts_controller.like_post);

module.exports = router;