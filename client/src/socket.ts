import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BASE_URL!, {
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  autoConnect: false,
});

export default socket;
