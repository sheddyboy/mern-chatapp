import { Avatar, Box, Typography } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { setSelectedUser } from "features/Auth/authSlice";
import { toggleProfileModal } from "features/Modal/modalSlice";
import { getRandomColor } from "helpers";
import { UserProps } from "models";
import { useEffect } from "react";

interface ChatBubbleProps {
  message: string;
  isSentByMe: boolean;
  senderAvatarUrl: string | "";
  isGroupChat: boolean;
  sender: UserProps;
}

const ChatBubble = ({
  message,
  isSentByMe,
  isGroupChat,
  sender,
  senderAvatarUrl,
}: ChatBubbleProps) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: isSentByMe ? "flex-end" : "flex-start",
        marginBottom: 1,
      }}
    >
      {!isSentByMe && (
        <Avatar
          src={senderAvatarUrl}
          sx={{ ml: 1, mr: 1, opacity: senderAvatarUrl === "" ? 0 : 1 }}
        />
      )}
      <Typography
        sx={{
          backgroundColor: isSentByMe ? "#1876D0" : "#f4f4f4",
          color: isSentByMe ? "#fff" : "",
          maxWidth: "70%",
          padding: "3px 15px",
          borderRadius: "16px",
          marginBottom: "2px",
          alignSelf: "center",
          position: "relative",
        }}
        variant="body1"
      >
        {!isSentByMe && isGroupChat && senderAvatarUrl && (
          <Typography
            component="span"
            display="block"
            variant="body1"
            color={getRandomColor(sender._id)}
            textTransform="capitalize"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(setSelectedUser(sender));
              dispatch(toggleProfileModal());
            }}
          >
            {sender.name}
          </Typography>
        )}
        {message}
      </Typography>
    </Box>
  );
};

export default ChatBubble;
