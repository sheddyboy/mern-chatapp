import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectedUser } from "features/Auth/authSlice";
import { toggleProfileModal } from "features/Modal/modalSlice";
import React, { useEffect } from "react";

const ProfileModal = () => {
  const [
    { profileModal, isUserModal },
    { user: loggedInUser, selectedUser },
    { selectedChat },
  ] = useAppSelector((state) => [
    state.modalSlice,
    state.authSlice,
    state.chatSlice,
  ]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const getSingleChatReceiverUser = () => {
    if (!selectedChat || selectedChat.isGroupChat || !loggedInUser) return;

    return selectedChat.users.find((user) => user._id !== loggedInUser._id);
  };

  const singleChatReceiverUser = getSingleChatReceiverUser();

  return (
    <Modal
      open={profileModal}
      onClose={() => {
        dispatch(toggleProfileModal());
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card
        sx={{
          width: 345,
          height: 280,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia sx={{ height: "150px" }} image="/profile-background.jpg" />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            bottom: 5,
            right: 0,
            left: 0,
          }}
        >
          <Avatar
            sx={{ width: 80, height: 80, marginBottom: 2 }}
            src={
              selectedUser
                ? selectedUser.picture
                : isUserModal
                ? loggedInUser?.picture
                : singleChatReceiverUser?.picture
            }
            imgProps={{
              sx: {
                objectPosition: "top",
              },
            }}
          />
          <Typography>
            {selectedUser
              ? selectedUser.name
              : isUserModal
              ? loggedInUser?.name
              : singleChatReceiverUser?.name}
          </Typography>
          <Typography variant="caption">
            {selectedUser
              ? selectedUser.email
              : isUserModal
              ? loggedInUser?.email
              : singleChatReceiverUser?.email}
          </Typography>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ProfileModal;
