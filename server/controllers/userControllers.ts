import { Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../helpers";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dphugvqtn",
  api_key: "184465192457814",
  api_secret: "yPgNVd1OYlgICmR7bmZVICdImSA",
});

const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  let imagePath = "";
  req.file &&
    (await cloudinary.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        imagePath = "";
      }
      if (result) {
        imagePath = result.secure_url;
      }
    }));
  if (!(name && email && password))
    return res
      .status(400)
      .json({ message: "Name Email and Password are required" });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  userModel
    .create({ name, email, password: hashedPassword, picture: imagePath })
    .then((user) => {
      const token = generateToken({ userId: user._id, email: user.email });
      return res.status(200).json({ user, token });
    })
    .catch(() => res.status(400).json({ message: "User already exists" }));
};

const logInController = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res.status(400).json({ message: "Email and Password are required" });

  userModel
    .findOne({ email })
    .then(async (user) => {
      if (user) {
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword)
          return res.status(401).json({ message: "Invalid Credentials" });

        if (isCorrectPassword)
          return res.status(200).json({
            user,
            token: generateToken({ userId: user._id, email: user.email }),
          });
      } else {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      return res.status(401).json({ message: err });
    });
};

const verifyController = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token required" });

  const { payload, error } = verifyToken(token);

  error && res.status(401).json(error);
  if (payload) {
    const { userId } = payload;
    userModel
      .findById(userId, { password: 0 })
      .then((user) => {
        user && res.status(200).json({ user, token });
        !user && res.status(400).json({ message: "User not found" });
      })
      .catch((err) => res.status(400).json(err));
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const allOrUser = req.query.search
    ? {
        $or: [
          { email: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
        _id: { $nin: req.user._id },
      }
    : { _id: { $nin: req.user._id } };

  try {
    const users = await userModel.find(allOrUser);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

export { logInController, registerController, verifyController, getAllUsers };
