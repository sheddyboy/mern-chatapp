import { Box, Drawer, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Navbar from "components/Navbar";
import SearchUser from "components/SearchUser";
import { toggleDrawerModal } from "features/Modal/modalSlice";
import React from "react";
import ChatListContainer from "components/ChatListContainer";
import ChatBoxWrapper from "components/ChatBoxWrapper";
import ProfileModal from "components/Modals/ProfileModal";
import CreateGroupChatModal from "components/Modals/CreateGroupChatModal";
import useSocket from "hooks/useSocket";
import GroupChatSettingsModal from "components/Modals/GroupChatSettingsModal";

const Dashboard = () => {
  useSocket();

  const { drawerModal } = useAppSelector((state) => state.modalSlice);

  const dispatch = useAppDispatch();

  const toggleDrawer =
    () => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      dispatch(toggleDrawerModal());
    };

  return (
    <Stack
      sx={{
        backgroundImage: "url(chat-background.jpg)",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <Drawer anchor="left" open={drawerModal} onClose={toggleDrawer()}>
        <SearchUser />
      </Drawer>
      <ProfileModal />
      <CreateGroupChatModal />
      <GroupChatSettingsModal />
      <Navbar />
      <Box flex="1" display="flex">
        <Grid container p={2} columnSpacing={2} flex="1">
          <ChatListContainer />
          <ChatBoxWrapper />
        </Grid>
      </Box>
    </Stack>
  );
};

export default Dashboard;
