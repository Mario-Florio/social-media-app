const express = require("express");
const dotenv = require("dotenv");
const logger = require('morgan');
const cors = require("cors");

const app = express();
dotenv.config();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
    res.json("Hello World");
});

module.exports = app;