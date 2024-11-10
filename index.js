const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
    .connect("mongodb://admin:1234@mongo:27017/?authSource=admin")
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => console.log("error connecting to db => ", e));

app.get("/", (req, res) => {
    res.send("<h2>Hi There!!!</h2>")
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
