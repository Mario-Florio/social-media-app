const app = require("./app");
const connectDB = require("./database/connection");

app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Listening on port "+process.env.PORT);
});