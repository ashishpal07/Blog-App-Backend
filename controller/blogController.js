const Blog = require("../models/blog");
const User = require("../models/user");

// GET ALL BLOGS
module.exports = {
  getAllBlogs: async (req, res) => {
    let blogs = await Blog.find();
    if (!blogs) {
      return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ blogs });
  },

  // CREATE Blog
  createBlog: async (req, res) => {
    const { title, description, image } = req.body;
    let newBlog = await Blog.create({
      title,
      description,
      image,
      user: req?.user?._id,
    });
    // await Blog.findById(newBlog._id).populate("user");

    let saveBlogInUser = await User.findByIdAndUpdate(
      req?.user?._id,
      { $push: { blogs: newBlog?._id } },
      { new: true }
    );

    if (!saveBlogInUser) {
      return res.status(500).json({ message: "Not Able To Update" });
    }

    return res.status(200).json({ newBlog });
  },

  // UPDATE BLOG BY ID
  updateBlog: async (req, res) => {
    const { title, description, image } = req.body;
    const id = req.params.id;

    let blog = await Blog.findById(id);
    if(!blog) {
        return res.status(404).json({message: "blog Not Found"});
    }

    if(blog.user.equals(req.user._id)) {
        let updateBlog = await Blog.findByIdAndUpdate(
            id, 
            {title, description, image},
            {new: true}
        );
        
        if (!updateBlog) {
          return res.status(500).json({ message: "Unable To Message" });
        }
        return res.status(200).json({ updateBlog });
    } else {
        return res.status(500).json({message: "Unauthorized This Not User Blog"});
    }
    
  },

  // GET BlOG BY ID
  getBlogById: async (req, res) => {
    const id = req.params.id;
    
    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }
    return res.status(200).json({ blod });
  },

  // DELETE BLOG BY ID
  deleteBlog: async (req, res) => {
    const id = req.params.id;
    let blog = await Blog.findById(id);
    
    if (!blog) {
        return res.status(500).json({ message: "Unable To Delete" });
    }
    
    if(blog.user.equals(req.user._id)) {
        let deleteBlogFromUser = await User.findByIdAndUpdate(blog?.user, {
            $pull: { blogs: id },
        });
    } else {
        return res.status(401).json({message: "Unauthorized User To Delete Blog"});
    }

    return res.status(200).json({ message: "Successfully Blog Deleted", blog });
  },

  // GET USERS ALL BLOG WHICH IS WRITTEN BY HIMSELF
  getUsersBlog: async (req, res) => {
    const id = req.user?._id;
    let allBlogs = await User.findById(id).populate("blogs");
      
    if (!allBlogs) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ blogs: allBlogs.blogs });
  }
};