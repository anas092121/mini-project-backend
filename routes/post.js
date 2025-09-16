import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import { isAuthenticated } from "../middleWares/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// Added 'upload.single("image")' middleware to handle image upload
router.post("/new", isAuthenticated, upload.single("image"), createPost);
router.put("/:id", isAuthenticated, upload.single("image"), updatePost);

router.get("/all", isAuthenticated, getAllPosts);
router.get("/:id", isAuthenticated, getPostById);
router.delete("/:id", isAuthenticated, deletePost);

export default router;
