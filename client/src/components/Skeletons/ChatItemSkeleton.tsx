import { Card, Skeleton } from "@mui/material";
import React from "react";

const ChatItemSkeleton = () => {
  return (
    <Card sx={{ padding: 1.5, mb: 1, backgroundColor: "whitesmoke" }}>
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="60%" />
    </Card>
  );
};

export default ChatItemSkeleton;
