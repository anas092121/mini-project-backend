import { Post } from "../models/post.js";
import { User } from "../models/user.js";

//
// create new post
export const createPost = async (req, res) => {
  const { title, caption, image, tags } = req.body;

  const post = await Post.create({
    user: req.user._id,
    title,
    caption,
    image,
    tags,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
};

//
// get all posts of a user
export const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate({ path: "user", select: "name" })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    posts,
  });
};

//
// get only one post with id
export const getPostById = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate({
    path: "user",
    select: "name",
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post Not Found",
    });
  }

  res.status(200).json({
    success: true,
    post,
  });
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, caption, image, tags } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
  // checking ownership of post
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  post.title = title || post.title;
  post.caption = caption || post.caption;
  post.image = image || post.image;
  post.tags = tags || post.tags;
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  // checking the ownership of post
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this post",
    });
  }

  await post.deleteOne();
  res.status(200).json({
    success: true,
    message: "Post Deleted Successfully",
  });
};
