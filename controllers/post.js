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

export const getPostById = (req, res) => {
  // To be implemented
};

export const updatePost = (req, res) => {
  // To be implemented
};

export const deletePost = (req, res) => {
  // To be implemented
};
