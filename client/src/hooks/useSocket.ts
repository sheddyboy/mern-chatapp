import { useAppSelector } from "app/hooks";
import { useEffect } from "react";
import socket from "socket";

const useSocket = () => {
  const [{ user }] = useAppSelector((state) => [
    state.authSlice,
    state.chatSlice,
  ]);

  useEffect(() => {
    socket.connect();
    socket.io.on("reconnect_attempt", (e) => {
      console.log("reconnect_attempt: ", e);
    });
    socket.io.on("reconnect_failed", () => {
      console.log("failed to connect to web socket");
    });

    socket.on("connected", () => {
      console.log("connected");
      socket.emit("create_user_room", user);
    });

    return () => {
      socket.off("connected");
      socket.close();
    };
  }, [user]);
};

export default useSocket;
