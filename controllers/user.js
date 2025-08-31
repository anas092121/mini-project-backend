import { sendCookie } from "../utils/features.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middleWares/errorHandler.js";

// register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exist", 409));

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    sendCookie(user, res, "Registered Succefully", 201);
  } catch (err) {
    next(err);
  }
};

// login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(new ErrorHandler("No user exist with this email", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Wrong Passwrod", 401));
    sendCookie(user, res, "Login Successfull", 200);
  } catch (err) {
    next(err);
  }
};

// get my profile
export const getMyProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// logout
export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", { expires: new Date(Date.now()) })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (err) {
    next(err);
  }
};
