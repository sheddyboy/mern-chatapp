import { NextFunction, Request, Response } from "express";

const noRouteFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `${req.method} ${req.path} not found` });
  next();
};

export default noRouteFound;
