const express = require("express");
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const postRouter = require("./routes/postRoutes");

const app = express();
app.use(express.json());

const cors = require("cors");

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () =>{
    mongoose
    .connect(mongoUrl)
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
        console.log("error connecting to db => ", e);
        setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();



app.use(cors());
app.get("/", (req, res) => {
    res.send("<h2>Hi There</h2>")
});

//localhost:3000/api/v1/posts/
app.use("/api/v1/posts", postRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
