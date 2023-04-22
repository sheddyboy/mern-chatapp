import { useAppDispatch } from "app/hooks";
import { store } from "app/store";
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
    const createUserRoomWhenConnected = () => {
      socket.on("connect", () => {
        console.log("Connected to server!");
        socket.emit("create_user_room", store.getState().authSlice.user);
      });
      socket.on("disconnect", (e) => {
        console.log("Disconnected from server! Reason: " + e);
      });
    };

    return () => createUserRoomWhenConnected();
  }, []);

  useEffect(() => {
    const messageOrNotification = () => {
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
    };

    return () => messageOrNotification();
  }, [dispatch]);
};

export default useSocket;
