const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODBURL)
    .then(res => console.log("Database connected"))
    .catch(err => console.log(err));

module.exports = mongoose;