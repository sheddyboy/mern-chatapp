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

const prevMessageByMe = (array: MessageProps[], index: number) => {
  if (index === 0) {
    return array[index].sender.picture;
  }
  if (array[index].sender._id === array[index - 1].sender._id) {
    return "";
  } else {
    return array[index].sender.picture;
  }
};

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
      {messages.map((message, index, array) => (
        <ChatBubble
          key={message._id}
          sender={message.sender}
          isGroupChat={message.chat.isGroupChat}
          message={message.message}
          isSentByMe={message.sender._id === loggedInUser._id}
          senderAvatarUrl={prevMessageByMe(array, index)}
        />
      ))}
      {isTypingInCurrentChat && socketTyping && (
        <img src="typingAnimation.gif" alt="" width={60} />
      )}
    </Stack>
  );
};

export default Chats;
