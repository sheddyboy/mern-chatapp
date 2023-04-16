import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/messageControllers";

const messageRoutes = Router();
messageRoutes.post("/", sendMessage);
messageRoutes.get("/:chatId", allMessages);

export default messageRoutes;
