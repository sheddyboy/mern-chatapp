import express, { json, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

// Configs
const app = express();
app.use(json());
app.use(cors());
dotenv.config();
app.use("/", (req: Request, res: Response, next) => {
  console.log(req.method, req.path, new Date());
  next();
});

// Routes
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Connected to mongoDB and listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => console.log(err));
