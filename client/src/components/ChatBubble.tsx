import { Paper, Typography } from "@mui/material";

interface ChatBubbleProps {
  message: string;
  isSentByMe: boolean;
}

const ChatBubble = ({ message, isSentByMe }: ChatBubbleProps) => {
  return (
    <Paper
      sx={{
        display: "inline-flex",
        maxWidth: "70%",
        padding: "3px 15px",
        borderRadius: "16px",
        marginBottom: "2px",
        backgroundColor: `${isSentByMe ? "#1876D0" : "#f4f4f4"}`,
        color: `${isSentByMe ? "#fff" : ""}`,
        alignSelf: `${isSentByMe ? "flex-end" : "flex-start"}`,
      }}
    >
      <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
        {message}
      </Typography>
    </Paper>
  );
};

export default ChatBubble;
