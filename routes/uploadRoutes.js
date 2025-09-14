import express from "express";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "postmux_uploads",
    });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
