import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import { isAuthenticated } from "../middleWares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createPost);
router.get("/all", isAuthenticated, getAllPosts);
router.get("/:id", isAuthenticated, getPostById);
router.put("/:id", isAuthenticated, updatePost); // Update post
router.delete("/:id", isAuthenticated, deletePost); // Delete post

export default router;
