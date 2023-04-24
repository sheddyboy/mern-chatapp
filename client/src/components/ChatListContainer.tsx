import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import React from "react";
import ChatItem from "./ChatItem";
import { useFetchUserChatsQuery } from "features/Chat/chatApi";
import { toggleCreateGroupChatModal } from "features/Modal/modalSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectedChat } from "features/Chat/chatSlice";
import ChatItemSkeletonContainer from "./Skeletons/ChatItemSkeletonContainer";
import socket from "socket";

const ChatListContainer = () => {
  const dispatch = useAppDispatch();
  const { isLoading, data: chats } = useFetchUserChatsQuery();
  const [{ selectedChat }, { user: loggedInUser }] = useAppSelector((state) => [
    state.chatSlice,
    state.authSlice,
  ]);

  return (
    <Grid
      item
      xs={selectedChat ? 0 : 12}
      sm={4}
      display={{ xs: selectedChat ? "none" : "flex", sm: "flex" }}
      flexDirection="column"
      minHeight="100%"
    >
      <Card sx={{ flex: "1" }}>
        <CardContent>
          <Stack>
            <Box
              display="flex"
              flexDirection={{ xs: "row", sm: "column", md: "row" }}
              rowGap={1}
              justifyContent={"space-between"}
              alignItems={{ xs: "flex-start", md: "center" }}
              mb={2}
            >
              <Typography variant="h6" fontWeight="300">
                My Chats
              </Typography>
              <Button
                endIcon={<AddIcon />}
                size="small"
                variant="outlined"
                onClick={() => dispatch(toggleCreateGroupChatModal())}
              >
                Group Chat
              </Button>
            </Box>
            <Box maxHeight="calc(100vh - 200px)" overflow="scroll">
              {isLoading ? (
                <ChatItemSkeletonContainer />
              ) : (
                <>
                  {chats?.map((chat) => (
                    <ChatItem
                      key={chat._id}
                      chat={chat}
                      selectedChat={selectedChat}
                      onClick={() => {
                        dispatch(setSelectedChat(chat));
                        socket.emit("join_chat", loggedInUser, chat._id);
                      }}
                    />
                  ))}
                </>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ChatListContainer;
