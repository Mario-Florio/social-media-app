const app = require("./app");
const mongoose = require("./database/connection");

app.listen(process.env.PORT, () => {
    console.log("Listening on port "+process.env.PORT);
});