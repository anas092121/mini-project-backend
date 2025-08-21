import mongoose from "mongoose";

export const connectDB = () => {
  console.log(process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));
};
