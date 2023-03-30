const express = require("express");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/connection");

dbConnection.conntionToMongo();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

app.listen(port, (err) => {
    if(err) {
        console.log("Error while connecting to server");
        return;
    }
    console.log(`Server running on ${ port }`);
});

