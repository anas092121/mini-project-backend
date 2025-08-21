import { sendCookie } from "../utils/features.js";
import { User } from "../models/user.js";

// register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      success: false,
      message: "User Already Exist",
    });
  }
  user = await User.create({ name, email, password });
  sendCookie(user, res, "Registered Succefully", 201);
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User doesn't exist with this email",
    });
  }
  const isMatch = (await password) == user.password;
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "Wrong Password",
    });
  }
  sendCookie(user, res, "Login Successfull", 200);
};

// get my profile
export const getMyProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// logout
export const logout = async (req, res) => {
  const user = req.user;
  res
    .status(200)
    .cookie("token", "", { expire: new Date(Date.now()) })
    .json({
      success: true,
      message: "Logged Out Succesfully",
    });
};
