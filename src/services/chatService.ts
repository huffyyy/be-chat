import * as chatRepositories from "../repositories/chatRepositories";
import { createMessageValues } from "../utils/schema/chat";
import path from "node:path";
import fs from "node:fs";

export const createRoomPersonal = async (sender_id: string, reciver_id: string) => {
  return await chatRepositories.createRoomPersonal(sender_id, reciver_id);
};

export const getRecentRoom = async (userId: string) => {
  return await chatRepositories.getRooms(userId);
};

export const getRoomMessage = async (roomId: string) => {
  return await chatRepositories.getRoomMessage(roomId);
};

export const createMessage = async (data: createMessageValues, userId: string, file: Express.Multer.File | undefined) => {
  const room = await chatRepositories.findRoomById(data.room_id);

  if (room.is_group) {
    const member = await chatRepositories.findMember(userId, room.id);

    if (!member) {
      const pathFile = path.join(__dirname, "../../public/assets/upload/attach_messages/", file?.filename ?? "");

      if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
      }

      throw new Error("You are not a member of this group");
    }
  }

  await chatRepositories.createMessage(data, userId, file);

  const message = await chatRepositories.createMessage(data, userId, file);
  return message;
};
