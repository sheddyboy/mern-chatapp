import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers";
import userModel from "../models/userModel";

const authorizeRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const { error, payload } = verifyToken(token);
    if (error) return res.status(401).json(error);
    try {
      const user = await userModel.findById(payload?.userId);
      if (user) req.user = user;
      if (!user) return res.status(400).json({ message: "user not found" });
    } catch (err) {
      return res.status(400).json(err);
    }
  } else {
    return res.status(401).json({ message: "Token Required" });
  }
  next();
};

export default authorizeRoute;
