import {
  Avatar,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  setIsUserModal,
  toggleDrawerModal,
  toggleProfileModal,
} from "features/Modal/modalSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { logOut } from "features/Auth/authSlice";
import { setSelectedChat } from "features/Chat/chatSlice";
import { MessageProps } from "models";
import { setNotification } from "features/Message/messageSlice";
import { useFetchUserChatsQuery } from "features/Chat/chatApi";
import StyledBadge from "./StyledBadge";

const Navbar = () => {
  const { data: chats } = useFetchUserChatsQuery();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const [{ notifications }, { user, isSocketConnected }] = useAppSelector(
    (state) => [state.messageSlice, state.authSlice]
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationClick = (message: MessageProps) => {
    if (!chats) return;
    const selectedChat = chats.find((chat) => chat._id === message.chat._id);
    const newNotificationsList = notifications.filter(
      (notification) => notification._id !== message._id
    );
    selectedChat && dispatch(setSelectedChat(selectedChat));
    dispatch(setNotification(newNotificationsList));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box paddingX={3} paddingY={2} sx={{ backgroundColor: "white" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
          onClick={() => dispatch(toggleDrawerModal())}
        >
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            size={sm ? "small" : "medium"}
          >
            {sm ? "Users" : "Search Users"}
          </Button>
        </Stack>
        <Typography
          variant={sm ? "h6" : "h5"}
          lineHeight={sm ? 1.1 : 1.6}
          fontWeight={300}
          textAlign="center"
        >
          Sheddy
          {sm ? <br /> : " "}
          Chat
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Badge
            ref={notificationRef}
            badgeContent={notifications?.length}
            onClick={() => setNotificationToggle((prev) => !prev)}
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <NotificationsIcon fontSize="small" />
          </Badge>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ cursor: "pointer", position: "relative" }}
            onClick={handleClick}
          >
            <Tooltip
              title={
                isSocketConnected
                  ? "Websocket Connected"
                  : "Websocket Disconnected"
              }
            >
              <StyledBadge
                online={isSocketConnected}
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  imgProps={{
                    sx: {
                      objectPosition: "top",
                    },
                  }}
                  src={user?.picture}
                />
              </StyledBadge>
            </Tooltip>
            <ExpandMoreIcon fontSize="small" id="options" />
          </Stack>
          <Menu
            id="options"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                dispatch(setIsUserModal(true));
                dispatch(toggleProfileModal());
              }}
            >
              My Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                dispatch(logOut());
              }}
            >
              LogOut
            </MenuItem>
          </Menu>
          {notifications.length > 0 && (
            <Menu
              open={notificationToggle}
              onClose={() => setNotificationToggle((prev) => !prev)}
              anchorEl={notificationRef.current}
            >
              {notifications.map((message) => (
                <MenuItem
                  key={message._id}
                  onClick={() => handleNotificationClick(message)}
                >{`New Message ${
                  message.chat.isGroupChat
                    ? `in ${message.chat.chatName}`
                    : `from ${message.sender.name}`
                }`}</MenuItem>
              ))}
            </Menu>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Navbar;
