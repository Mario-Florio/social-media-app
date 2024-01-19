
function createApp(database) {
    const express = require("express");

    const dotenv = require("dotenv");
    const logger = require('morgan');
    const cors = require("cors");

    const usersRouter = require("./routes/users");

    const app = express();
    dotenv.config();

    app.use(logger("dev"));
    app.use(cors());
    app.use(express.json());

    app.get("/", (req, res, next) => {
        res.json("Hello World");
    });

    app.use("/users", usersRouter);

    return app;
}

module.exports = createApp;