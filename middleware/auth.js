const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.authenticate = async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        token = req?.headers?.authorization?.split(" ")[1];
    }

    if(token == 'undefined' || !token) {
        return res.status(401).json({ message: "Token Unathorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    let user;
    try {
        user = await User.findById(decode?.id);
    } catch (err) {
        return console.log("Error while authenticate token");
    }
    if(!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
}