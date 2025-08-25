import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

router.post("/new", createPost); // Create a new post
router.get("/", getAllPosts); // Get all posts
router.get("/:id", getPostById); // Get single post
router.put("/:id", updatePost); // Update post
router.delete("/:id", deletePost); // Delete post

export default router;
