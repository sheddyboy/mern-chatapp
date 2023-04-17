import { Request, Response } from "express";
import messageModel from "../models/messageModel";
import { Types } from "mongoose";

const sendMessage = async (req: Request, res: Response) => {
  const { message: content, chatId } = req.body;

  try {
    const message = await messageModel.create({
      chat: chatId,
      message: content,
      sender: req.user._id,
    });
    await message.populate("sender", "name picture");
    await message.populate("chat");
    await message.populate("chat.users", "name picture email");

    res.status(201).json(message);
  } catch (err) {
    res.status(400).json(err);
  }
};

const allMessages = async (req: Request, res: Response) => {
  const chatId = req.params.chatId;

  try {
    const messages = await messageModel
      .find({ "chat._id": chatId })
      .populate("sender", "name picture email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export { sendMessage, allMessages };
