const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));

router.use("/blog", require("./blog"));

router.use("/comment", require("./comment"))

module.exports = router;