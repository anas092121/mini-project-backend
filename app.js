import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleWares/errorHandler.js";
import cors from "cors";

config({ path: "./data/config.env" }); // load env first

export const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONT_URL.split(","),
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.get("/", (req, res) => {
  res.json({
    title: "Social Media Post Creator",
    description:
      "A MERN stack app to create, schedule, and manage social media posts with AI captions.",
    status: "Backend is running",
  });
});

// error handling middleware
app.use(errorMiddleware);
