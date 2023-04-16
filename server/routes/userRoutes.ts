import { Router } from "express";
import {
  getAllUsers,
  logInController,
  registerController,
  verifyController,
} from "../controllers/userControllers";
import authorizeRoute from "../middlewares/authorizeRoute";
import upload from "../middlewares/upload";

const userRoutes = Router();
const [uploadPicture, uploadNone] = upload();
userRoutes.post("/register", uploadPicture, registerController);
userRoutes.post("/login", uploadNone, logInController);
userRoutes.get("/", authorizeRoute, getAllUsers);
userRoutes.post("/verify", verifyController);

export default userRoutes;
