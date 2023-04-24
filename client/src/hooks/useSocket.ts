import { useAppDispatch } from "app/hooks";
import { store } from "app/store";
import {
  removeFromOnlineIds,
  setOnlineIds,
  setSocketConnection,
} from "features/Auth/authSlice";
import messageApi from "features/Message/messageApi";
import { setNotification } from "features/Message/messageSlice";
import { MessageProps } from "models";
import { useEffect } from "react";
import socket from "socket";

const useSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.off("connected");
      socket.off("disconnect");
      socket.off("receive_message");
      socket.off("send_message_error");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const reconnection = () => {
      socket.io.on("reconnect_attempt", (e) => {
        console.log("reconnect_attempt: ", e);
      });
      socket.io.on("reconnect_failed", () => {
        console.log("failed to connect to web socket");
      });
    };
    return () => reconnection();
  }, []);

  useEffect(() => {
    // const createUserRoomWhenConnected = () => {
    console.log("first");
    socket.on("connected", () => {
      console.log("connected received");
      socket.emit("create_user_room", store.getState().authSlice.user);
      socket.emit(
        "check_online_users",
        store.getState().authSlice.user?.friends
      );
      socket.on("get_online_users", (onlineUsers: string[]) => {
        dispatch(setOnlineIds(onlineUsers));
      });
      socket.on("a_user_connected", (userId: string) => {
        dispatch(setOnlineIds(userId));
      });
      socket.on("a_user_disconnected", (userId: string) => {
        dispatch(removeFromOnlineIds(userId));
      });
      dispatch(setSocketConnection(true));
    });
    socket.on("disconnect", (e) => {
      console.log("Disconnected from server! Reason: " + e);
      dispatch(setSocketConnection(false));
    });
    // };

    // return () => createUserRoomWhenConnected();
  }, [dispatch]);

  useEffect(() => {
    console.log("second");
    // const messageOrNotification = () => {
    socket.on("receive_message", (message: MessageProps) => {
      dispatch(
        messageApi.util.updateQueryData(
          "getChatMessages",
          { chatId: message.chat._id },
          (messagesCache) => {
            messagesCache.push(message);
          }
        )
      );
      if (message.chat._id !== store.getState().chatSlice.selectedChat?._id) {
        console.log("send notification");
        dispatch(setNotification(message));
      }
    });
    socket.on("send_message_error", (err) => {
      console.log(err);
    });
    // };

    // return () => messageOrNotification();
  }, [dispatch]);
};

export default useSocket;
