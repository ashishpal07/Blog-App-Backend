const Comment = require("../models/comment");
const Blog = require("../models/blog");
const User = require("../models/user");

module.exports = {

  // CREATE COMMENT
  commentCreate: async (req, res) => {
    const blogId = req.params.blogId;
    const { content } = req.body;

    // comment created and stores user and blog
    let comment = await Comment.create({
      comment: content,
      user: req.user._id,
      blog: blogId,
    });

    if (!comment) {
      return res
        .status(500)
        .json({ message: "Internal Server Error - creating comment" });
    }

    // save commentId in Blog.comments
    let saveCommentInBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    if (!saveCommentInBlog) {
      return res
        .status(500)
        .json({ message: "Internal Server Error - saveCommentInBlog" });
    }

    // save comment in user
    let saveCommentInUser = await User.findByIdAndUpdate(
      req?.user?._id,
      { $push: { comments: comment._id } },
      { new: true }
    );

    if (!saveCommentInBlog) {
      return res
        .status(500)
        .json({ message: "Internal Server Error - saveCommentInUser" });
    }

    return res.status(201).json({ comment });
  },

  // DELLETE COMMENT
  deleteComment: async (req, res) => {
    const commentId = req.params.id;

    let comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    if (comment.user == req.user._id) {
      let deleteComment = await Comment.findByIdAndDelete(commentId);
      if(!deleteComment) {
        return res.status(401).json({ message: "Not Able To Delete Comment" });
      }

      let deleteFromUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { comments: commentId } },
        { new: true }
      );
      if(!deleteFromUser) {
        return res.status(401).json({ message: "Not Able To Delete From User" });
      }

      let deleteFromBlog = await Blog.findByIdAndUpdate(comment.blog, {
        $pull: { comments: commentId },
      });
      if(!deleteFromBlog) {
        return res.status(401).json({ message: "Not Able To Delete From Blog" });
      }

    } else {
      return res.status(400).json({ message: "Unauthorized Not Your Comment" });
    }
  }
};
