const createApp = require("./app");
const mongoose = require("./database/connection");

const app = createApp();

app.listen(process.env.PORT, () => {
    console.log("Listening on port "+process.env.PORT);
});