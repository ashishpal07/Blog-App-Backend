const express = require("express");
const commentController = require("../../../controller/commentController");
const { authenticate } = require("../../../middleware/auth");
const router = express.Router();

router.post("/create/:blogId", authenticate, commentController.commentCreate);

router.delete("/:id", authenticate, commentController.deleteComment);

module.exports = router;