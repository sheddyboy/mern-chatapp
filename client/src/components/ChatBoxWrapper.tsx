import { Card, CardContent, Grid, Typography } from "@mui/material";

import React from "react";
import { useAppSelector } from "app/hooks";

import ChatBox from "./ChatBox";

const ChatBoxWrapper = () => {
  const { selectedChat } = useAppSelector((state) => state.chatSlice);

  return (
    <Grid
      item
      xs={selectedChat ? 12 : 0}
      sm={8}
      display={{ xs: selectedChat ? "flex" : "none", sm: "flex" }}
      flexDirection="column"
    >
      {selectedChat ? (
        <ChatBox selectedChat={selectedChat} />
      ) : (
        <Card
          sx={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="300"
              color="initial"
              textAlign="center"
            >
              Select a chat <br />
              Or <br />
              Search a user
            </Typography>
          </CardContent>
        </Card>
      )}
    </Grid>
  );
};

export default ChatBoxWrapper;
