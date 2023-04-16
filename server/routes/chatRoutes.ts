import { Router } from "express";
import {
  addToGroup,
  createGroupChat,
  getUserChats,
  removeFromGroup,
  renameGroup,
  singleChat,
  updateGroupChat,
} from "../controllers/chatControllers";

const chatRoutes = Router();

chatRoutes.post("/", singleChat);
chatRoutes.get("/", getUserChats);
chatRoutes.post("/group", createGroupChat);
chatRoutes.put("/group", updateGroupChat);
chatRoutes.patch("/rename-group", renameGroup);
chatRoutes.patch("/add-to-group", addToGroup);
chatRoutes.delete("/remove-from-group", removeFromGroup);

export default chatRoutes;
