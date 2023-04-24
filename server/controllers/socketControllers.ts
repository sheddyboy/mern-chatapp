import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { ChatProps, MessageProps, UserProps } from "../../types";
import messageModel from "../models/messageModel";
import userModel from "../models/userModel";

const socketControllers = (socket: Socket, io: Server) => {
  socket.emit("connected");
  // User connected
  console.log("connected id: ", socket.id);

  //   Create user room
  socket.on("create_user_room", (user: UserProps) => {
    if (socket.rooms.has(user._id)) return;
    socket.join(user._id);
    console.log(user.name + " joined room " + user._id);
    socket.emit("connected");
    socket.to(user.friends).emit("a_user_connected", user._id);

    // User leaves chat
    socket.on("disconnecting", (e) => {
      if (socket.rooms.has(user._id)) {
        console.log(user.name + " left room " + user._id);
        socket.to(user.friends).emit("a_user_disconnected", user._id);
      }
    });
  });

  // Check online users
  socket.on("check_online_users", (usersIds: string[]) => {
    const onlineUsers = usersIds.filter((userId) =>
      io.sockets.adapter.rooms.has(userId)
    );
    socket.emit("get_online_users", onlineUsers);
  });

  //   New chat
  socket.on("new_chat", (chat: ChatProps, user: UserProps) => {
    chat.users.map((chatUser, index, array) => {
      userModel
        .findOneAndUpdate(
          { _id: chatUser._id },
          {
            $addToSet: {
              friends: {
                $each: chat.users.filter((user) => user._id !== chatUser._id),
              },
            },
          },
          { new: true }
        )
        .then((user) => {
          io.to(chatUser._id).emit("new_chat_sent", chat, user);
        });
    });
  });

  //   User joins chat
  socket.on("join_chat", (loggedInUser: UserProps, chatId: string) => {
    if (socket.rooms.has(chatId)) return;
    socket.join(chatId);
    console.log(loggedInUser.name + " joined room " + chatId);
  });

  //   User sends message
  socket.on(
    "send_message",
    async (
      sender: UserProps,
      chat: ChatProps,
      usersIds: { _id: Types.ObjectId }[],
      sentMessage: string
    ) => {
      console.log(`${sender.name} is sending a message to ${chat.chatName}`);
      try {
        const message = await messageModel.create({
          chat: {
            _id: chat._id,
            chatName: chat.chatName,
            isGroupChat: chat.isGroupChat,
            users: usersIds,
          },
          message: sentMessage,
          sender: {
            _id: sender._id,
            name: sender.name,
            picture: sender.picture,
            email: sender.email,
          },
        });

        const userIds = chat.users.map((user) => user._id);
        io.to(userIds).emit("receive_message", message);
      } catch (err) {
        socket.to(sender._id).emit("send_message_error", err);
      }
    }
  );

  //   User start typing
  socket.on("start_typing", (chatId: string) => {
    console.log("user typing");
    socket.to(chatId).emit("start_typing", chatId);
  });

  //   User stop typing
  socket.on("stop_typing", (chatId: string) => {
    console.log("user not typing");
    socket.to(chatId).emit("stop_typing", chatId);
  });

  //   User disconnected
  socket.on("disconnect", (reason) => {
    console.log("Disconnected Reason: ", reason);
  });
};

export default socketControllers;
