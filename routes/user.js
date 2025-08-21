import express from "express";
import { getMyProfile, login, logout, register } from "../controllers/user.js";
import { isAuthenticated } from "../middleWares/auth.js";

const router = express.Router();

router.post("/new", register); // register
router.post("/login", login); // login
router.get("/me", isAuthenticated, getMyProfile); // get my profile
router.post("/logout", logout); // logout

export default router;
