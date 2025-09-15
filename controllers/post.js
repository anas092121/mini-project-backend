import { Post } from "../models/post.js";
import ErrorHandler from "../middleWares/errorHandler.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Create new post
export const createPost = async (req, res, next) => {
  try {
    const { title, caption, image, tags } = req.body;

    if (!title || !caption)
      return next(new ErrorHandler("Title and caption are required", 400));

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "postmux_uploads",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const post = await Post.create({
      user: req.user._id,
      title,
      caption,
      image,
      tags,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    next(err); // All unexpected errors handled by global middleware
  }
};

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate({ path: "user", select: "name" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "name",
    });

    if (!post) return next(new ErrorHandler("Post not found", 404));

    res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
};

// Update a post
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // Check ownership
    if (post.user.toString() !== req.user._id.toString())
      return next(new ErrorHandler("Unauthorized", 403));

    const { title, caption, image, tags } = req.body;

    if (req.file) {
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "postmux_uploads",
      });

      post.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    post.title = title || post.title;
    post.caption = caption || post.caption;
    post.tags = tags || post.tags;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // Check ownership
    if (post.user.toString() !== req.user._id.toString())
      return next(new ErrorHandler("Not authorized to delete this post", 403));

    if (post.image?.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
