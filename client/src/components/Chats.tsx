import { Stack } from "@mui/material";
import { ChatProps, MessageProps, UserProps } from "models";
import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

interface ChatsProps {
  messages: MessageProps[];
  loggedInUser: UserProps;
  socketTyping: boolean;
  socketTypingRoom: string;
  selectedChat: ChatProps;
}

const Chats = ({
  loggedInUser,
  messages,
  socketTyping,
  socketTypingRoom,
  selectedChat,
}: ChatsProps) => {
  const isTypingInCurrentChat = socketTypingRoom === selectedChat._id;
  const chatsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chatsRef.current) return;
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  }, [messages, socketTyping]);

  return (
    <Stack
      spacing={1}
      maxHeight="calc(100vh - 220px)"
      overflow="scroll"
      py={1}
      ref={chatsRef}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message._id}
          message={message.message}
          isSentByMe={message.sender._id === loggedInUser._id}
        />
      ))}
      {isTypingInCurrentChat && socketTyping && (
        <img src="typingAnimation.gif" alt="" width={60} />
      )}
    </Stack>
  );
};

export default Chats;
