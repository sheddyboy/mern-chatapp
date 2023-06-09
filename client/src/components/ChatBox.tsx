import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CircularProgress,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { ChatProps } from "models";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import React, { useEffect, useRef, useState } from "react";
import Chats from "./Chats";
import { useGetChatMessagesQuery } from "features/Message/messageApi";
import { removeSelectedChat } from "features/Chat/chatSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import socket from "socket";
import debounce from "lodash.debounce";
import {
  setIsUserModal,
  toggleGroupChatSettingsModal,
  toggleProfileModal,
} from "features/Modal/modalSlice";
import StyledBadge from "./StyledBadge";

interface ChatBoxProps {
  selectedChat: ChatProps;
}

const ChatBox = ({ selectedChat }: ChatBoxProps) => {
  const dispatch = useAppDispatch();
  const { user: loggedInUser, onlineUserIds } = useAppSelector(
    (state) => state.authSlice
  );
  const { data: messages, isFetching } = useGetChatMessagesQuery({
    chatId: selectedChat._id,
  });

  const [socketTyping, setSocketTyping] = useState(false);
  const [socketTypingRoom, setSocketTypingRoom] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("start_typing", (chatId: string) => {
      setSocketTyping(true);
      setSocketTypingRoom(chatId);
    });
    socket.on("stop_typing", (chatId: string) => {
      setSocketTyping(false);
      setSocketTypingRoom(chatId);
    });

    return () => {
      socket.off("start_typing");
      socket.off("stop_typing");
    };
  }, []);

  const getReceiver = () => {
    if (!loggedInUser) return;
    return selectedChat.users.find((user) => user._id !== loggedInUser._id);
  };

  const getOnlineStatus = (userId: string) => {
    return onlineUserIds.includes(userId);
  };

  const selectedChatUsers = selectedChat.users.map((user) => {
    return { _id: user._id };
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput) return;
    socket.emit("stop_typing", selectedChat?._id);
    socket.emit(
      "send_message",
      loggedInUser,
      selectedChat,
      selectedChatUsers,
      messageInput
    );

    setMessageInput("");
  };

  const handleKeyDown = () => {
    if (!isTyping) {
      console.log("typing");
      socket.emit("start_typing", selectedChat?._id);
      setIsTyping(true);
    }
  };
  const debounceHandleKeyUp = useRef(
    debounce(() => {
      console.log("not typing");
      socket.emit("stop_typing", selectedChat?._id);
      setIsTyping(false);
    }, 3000)
  );

  return (
    <Card
      sx={{
        flex: "auto",
        padding: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <IconButton onClick={() => dispatch(removeSelectedChat())}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="300" textTransform="capitalize">
            {selectedChat?.isGroupChat
              ? selectedChat.chatName
              : getReceiver()?.name}
          </Typography>
          {selectedChat.isGroupChat ? (
            <AvatarGroup max={3}>
              {selectedChat.users.map((user) => (
                <Avatar
                  sx={{ width: 25, height: 25 }}
                  key={user._id}
                  alt={user.name}
                  src={user.picture}
                />
              ))}
            </AvatarGroup>
          ) : (
            <StyledBadge
              online={getOnlineStatus(getReceiver()?._id ?? "")}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                sx={{ width: 25, height: 25 }}
                alt={getReceiver()?.name}
                src={getReceiver()?.picture}
              />
            </StyledBadge>
          )}
        </Box>
        {selectedChat.isGroupChat ? (
          <IconButton
            onClick={() => {
              dispatch(toggleGroupChatSettingsModal());
            }}
          >
            <ManageAccountsIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              dispatch(setIsUserModal(false));
              dispatch(toggleProfileModal());
            }}
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </Box>
      <Card
        sx={{
          padding: 1,
          backgroundColor: "white",
          flex: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: `${isFetching ? "center" : ""}`,
          alignItems: `${isFetching ? "center" : ""}`,
          position: "relative",
        }}
      >
        {messages && loggedInUser && !isFetching ? (
          <Chats
            loggedInUser={loggedInUser}
            messages={messages}
            socketTyping={socketTyping}
            socketTypingRoom={socketTypingRoom}
            selectedChat={selectedChat}
          />
        ) : (
          <CircularProgress sx={{ position: "absolute" }} />
        )}
        <Box
          component="form"
          display="flex"
          alignItems="center"
          position="absolute"
          bottom="0"
          right="0"
          left="0"
          px={1}
          onSubmit={handleSubmit}
        >
          <InputBase
            placeholder="Enter a message"
            type="text"
            size="small"
            sx={{
              backgroundColor: "#ebe7ef14",
              flex: "auto",
            }}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={debounceHandleKeyUp.current}
          />
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </Box>
      </Card>
    </Card>
  );
};

export default ChatBox;
