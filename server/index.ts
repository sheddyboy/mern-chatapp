import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import noRouteFound from "./middlewares/noRouteFound";
import authorizeRoute from "./middlewares/authorizeRoute";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { Server } from "socket.io";
import { createServer } from "http";
import socketControllers from "./controllers/socketControllers";

// Configs
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    // methods: ["GET", "POST"],
    // credentials: true,
  },
});
app.use(json());
app.use(cors());
app.use("/", (req, res, next) => {
  console.log(req.method, req.path, new Date());
  next();
});
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", authorizeRoute, chatRoutes);
app.use("/api/message", authorizeRoute, messageRoutes);

// No Route Found
app.use(noRouteFound);

// Socket.io
io.on("connection", (socket) => socketControllers(socket, io));

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(
        `Connected to mongoDB and listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => console.log(err));
