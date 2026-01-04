import express from "express";
import * as chatController from "../controllers/chatController";
import verifyToken from "../middleware/verifyToken";

const chatRoutes = express.Router();

chatRoutes.get("/chat/rooms", verifyToken, chatController.getRooms);
chatRoutes.post("/chat/rooms", verifyToken, chatController.createRoomPersonal);

export default chatRoutes;
