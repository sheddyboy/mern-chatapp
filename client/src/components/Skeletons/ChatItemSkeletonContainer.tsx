import React from "react";
import ChatItemSkeleton from "./ChatItemSkeleton";

const ChatItemSkeletonContainer = () => {
  return (
    <>
      {new Array(20).fill(0).map((val, index) => (
        <ChatItemSkeleton key={index} />
      ))}
    </>
  );
};

export default ChatItemSkeletonContainer;
