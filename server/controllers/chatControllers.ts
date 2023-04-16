import { Request, Response } from "express";
import chatModel from "../models/chatModel";

const singleChat = async (req: Request, res: Response) => {
  const { _id: senderId } = req.user;

  try {
    const chat = await chatModel.findOne({
      isGroupChat: false,
      users: { $all: [senderId, req.body.receiverId] },
    });
    if (chat) {
      res.status(200).json(chat);
    } else {
      try {
        await chatModel.create({
          chatName: "Sender",
          users: [senderId, req.body.receiverId],
        });

        try {
          const chat = await chatModel.findOne({
            isGroupChat: false,
            users: { $all: [senderId, req.body.receiverId] },
          });
          chat && res.status(200).json(chat);
        } catch (err) {
          console.log("3");
          res.status(400).json();
        }
      } catch (err) {
        console.log("2");
        res.status(400).json(err);
      }
    }
  } catch (err) {
    console.log("1");
    res.status(400).json(err);
  }
};

const getUserChats = async (req: Request, res: Response) => {
  try {
    const chats = await chatModel.find({ users: { $all: [req.user.id] } });
    res.status(200).json(chats);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createGroupChat = async (req: Request, res: Response) => {
  const { usersIds, chatName } = req.body;

  if (usersIds.length > 1) {
    try {
      const createdGroupChat = await chatModel.create({
        chatName,
        isGroupChat: true,
        users: [...usersIds, req.user.id],
        groupAdmin: req.user.id,
      });

      try {
        const groupChat = await chatModel.findOne({
          _id: createdGroupChat._id,
        });
        res.status(201).json(groupChat);
      } catch (err) {
        res.status(400).json(err);
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res
      .status(400)
      .json({ message: "More than 2 users to create a group chat" });
  }
};

const updateGroupChat = async (req: Request, res: Response) => {
  const { usersIds, chatName, groupId } = req.body;

  try {
    const updatedGroupChat = await chatModel.findOneAndUpdate(
      { _id: groupId },
      { chatName, users: usersIds },
      { new: true }
    );
    if (updatedGroupChat) {
      return res.status(200).json(updatedGroupChat);
    } else {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
const renameGroup = async (req: Request, res: Response) => {
  const { groupChatId: id, newGroupChatName: name } = req.body;

  try {
    const updatedGroupChat = await chatModel.findOneAndUpdate(
      { _id: id },
      { chatName: name },
      { new: true }
    );
    if (updatedGroupChat) {
      return res.status(200).json(updatedGroupChat);
    } else {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const addToGroup = async (req: Request, res: Response) => {
  const { users, groupChatId: _id } = req.body;

  try {
    const updatedGroupChat = await chatModel.findOneAndUpdate(
      { _id },
      { $addToSet: { users: { $each: users } } },
      { new: true }
    );

    !updatedGroupChat && res.status(404).json({ message: "Chat not found" });
    updatedGroupChat && res.status(200).json(updatedGroupChat);
  } catch (err) {
    res.status(400).json(err);
  }
};

const removeFromGroup = async (req: Request, res: Response) => {
  const { users, groupChatId: _id } = req.body;
  try {
    const updatedGroupChat = await chatModel.findOneAndUpdate(
      { _id },
      { $pull: { users: { $in: users } } },
      { new: true }
    );

    !updatedGroupChat && res.status(404).json({ message: "Chat not found" });
    updatedGroupChat && res.status(200).json(updatedGroupChat);
  } catch (err) {
    res.status(400).json(err);
  }
};

export {
  singleChat,
  getUserChats,
  createGroupChat,
  updateGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
