const express = require("express");
const router = express.Router();
const { authenticate } = require("../../../middleware/auth");
const blogController = require("../../../controller/blogController");

router.get("/all-blogs", blogController.getAllBlogs);

router.post("/create", authenticate, blogController.createBlog);

router.put("/update/:id", authenticate, blogController.updateBlog);

router.delete("/delete/:id", authenticate, blogController.deleteBlog);

router.get("/self-all-blogs", authenticate, blogController.getUsersBlog);

module.exports = router;