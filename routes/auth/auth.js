const express = require("express");

const router = express.Router();

router.post("/", (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400);
    }
    res.json({ user: 0 });
});

module.exports = router;