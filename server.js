const createApp = require("./app");
const mongoose = require("./database");

const app = createApp(mongoose);

app.listen(process.env.PORT, () => {
    console.log("Listening on port "+process.env.PORT);
});