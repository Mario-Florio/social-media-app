const app = require("./app");
const connectDB = require("./database/connection");
const dotenv = require("dotenv");

dotenv.config();

app.listen(process.env.PORT, async () => {
    await connectDB();
    console.log("Listening on port "+process.env.PORT);
});