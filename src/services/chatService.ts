import * as chatRepositories from "../repositories/chatRepositories";

export const createRoomPersonal = async (sender_id: string, reciver_id: string) => {
  return await chatRepositories.createRoomPersonal(sender_id, reciver_id);
};
