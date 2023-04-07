import { Request, Response } from "express";

const registerController = (req: Request, res: Response) => {
  res.status(200).json({ mes: "we good yah" });
};

const logInController = (req: Request, res: Response) => {
  res.status(200).json({ mes: "we good" });
};

export { logInController, registerController };
