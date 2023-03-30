const express = require("express");
const userController = require("../../../controller/userController");
const { authenticate } = require("../../../middleware/auth");
const router = express.Router();

router.get("/all-user", authenticate, userController.getAllUser);

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

module.exports = router;