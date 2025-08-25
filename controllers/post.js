import { Post } from "../models/post.js";

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

export const getAllPosts = (req, res) => {
  // To be implemented
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
