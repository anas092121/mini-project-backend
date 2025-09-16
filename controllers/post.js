import { Post } from "../models/post.js";
import ErrorHandler from "../middleWares/errorHandler.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Create new post
export const createPost = async (req, res, next) => {
  try {
    const { title, caption, tags } = req.body;
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : []; // convert tags string to array

    if (!title || !caption)
      return next(new ErrorHandler("Title and caption are required", 400));

    let imageData = {}; // store image as object {url, public_id}
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "postmux_uploads", // set Cloudinary folder
      });
      imageData = { url: result.secure_url, public_id: result.public_id }; // save public_id
      fs.unlinkSync(req.file.path); // remove temp local file
    }

    const post = await Post.create({
      user: req.user._id,
      title,
      caption,
      tags: tagsArray, // save tags as array
      image: imageData,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    next(err);
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

    const { title, caption, tags } = req.body; // destructure first
    const tagsArray = tags
      ? tags.split(",").map((tag) => tag.trim())
      : post.tags; // parse tags string to array

    if (req.file) {
      if (post.image?.public_id) {
        // delete previous image from Cloudinary
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "postmux_uploads",
      });
      post.image = { url: result.secure_url, public_id: result.public_id }; // save new image info
      fs.unlinkSync(req.file.path); // remove temp local file
    }

    post.title = title || post.title;
    post.caption = caption || post.caption;
    post.tags = tagsArray; // assign parsed array

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
      // remove image from Cloudinary
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
