const mongoose = require("mongoose");

async function connectDB() {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODBURL)
        .then(res => console.log("Database connected"))
        .catch(err => console.log(err));
}

module.exports = connectDB;