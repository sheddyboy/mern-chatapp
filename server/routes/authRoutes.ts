import { Router } from "express";
import {
  logInController,
  registerController,
} from "../controllers/authControllers";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", logInController);

export default authRoutes;
