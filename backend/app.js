const express = require("express");

const dotenv = require("dotenv");
const logger = require('morgan');
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth/auth");
const usersRouter = require("./routes/users/users");
const forumsRouter = require("./routes/forums/forums");
const postsRouter = require("./routes/posts/posts");
const commentsRouter = require("./routes/comments/comments");
const photoAlbumsRouter = require("./routes/photo-albums/photo-albums");

const app = express();
dotenv.config();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/api", (req, res, next) => {
    res.json("Hello World");
});

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/forums", forumsRouter);

app.use("/api/posts", postsRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/photo-albums", photoAlbumsRouter);

module.exports = app;