import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";

config({ path: "./data/config.env" }); // load env first

export const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", postRouter);

app.get("/", (req, res) => {
  res.send("Server Started");
});
