const express = require("express");

const dotenv = require("dotenv");
const logger = require('morgan');
const cors = require("cors");

const authRouter = require("./routes/auth/auth");
const usersRouter = require("./routes/users/users");
const forumsRouter = require("./routes/forums/forums");
const postsRouter = require("./routes/posts/posts");
const commentsRouter = require("./routes/comments/comments");

const app = express();
dotenv.config();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res, next) => {
    res.json("Hello World");
});

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/forums", forumsRouter);

app.use("/api/posts", postsRouter);

app.use("/api/comments", commentsRouter);

module.exports = app;