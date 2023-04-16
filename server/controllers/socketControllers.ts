import { Socket } from "socket.io";
import { MessageProps, UserProps } from "../../types";

const socketControllers = (socket: Socket) => {
  // User connected
  console.log("connected id: ", socket.id);
  socket.emit("connected");
  //   Create user room
  socket.on("create_user_room", (user: UserProps) => {
    if (socket.rooms.has(user._id)) return;
    socket.join(user._id);
    console.log(user.name + " joined room " + user._id);
    socket.emit("connected");
  });

  //   User joins chat
  socket.on("join_chat", (chatId: string) => {
    if (socket.rooms.has(chatId)) return;
    socket.join(chatId);
    console.log("User joined room " + chatId);
  });

  //   User sends message
  socket.on("send_message", (message: MessageProps) => {
    console.log("send_message");
    const senderId = message.sender._id;
    const users = message.chat.users;

    users.map((user) => {
      if (user._id === senderId) return;
      console.log("receive_message");

      socket.to(user._id).emit("receive_message", message);
    });
  });

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
