import { Card, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { ChatProps } from "models";
import React from "react";
interface ChatItemProps {
  chat: ChatProps;
  selectedChat: ChatProps | null;
  onClick: () => void;
}

const ChatItem = ({ chat, onClick, selectedChat }: ChatItemProps) => {
  const { isGroupChat, users, chatName } = chat;
  const { user: loggedInUser } = useAppSelector((state) => state.authSlice);

  const receiverUser = users.find((user) => user._id !== loggedInUser?._id);

  return (
    <Card
      onClick={() => onClick()}
      sx={{
        backgroundColor: `${
          selectedChat?._id === chat._id ? "#1976d2" : "whitesmoke"
        }`,
        color: `${selectedChat?._id === chat._id ? "#fff" : "#000"}`,
        padding: 1,
        cursor: "pointer",
        mb: 1,
        ":hover": { backgroundColor: "#1976d2", color: "#fff" },
      }}
    >
      <Typography variant="body1" textTransform="capitalize">
        {isGroupChat ? chatName : receiverUser?.name}
      </Typography>
      <Typography variant="caption" component="span" fontWeight="600">
        {chat.latestMessage ? `${chat.latestMessage.sender.name}: ` : " "}
      </Typography>
      <Typography variant="caption">
        {chat.latestMessage ? `${chat.latestMessage.message}` : " "}
      </Typography>
    </Card>
  );
};

export default ChatItem;
