const mongoose = require("mongoose");

module.exports.conntionToMongo = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with mongoDB server successfully");
    } catch(err) {
        console.log("Error while connecting to mongoDB server");
    }
}
