import prisma from "../utils/prisma";
import * as userRepositories from "../repositories/userRepositories";

export const createRoomPersonal = async (sender_id: string, reciver_id: string) => {
  const room = await prisma.room.findFirst({
    where: {
      members: {
        every: {
          user_id: {
            in: [sender_id, reciver_id]
          }
        }
      },
      is_group: false
    }
  });

  const owner = await userRepositories.findRole("OWNER");
  const memeber = await userRepositories.findRole("MEMBER");

  return await prisma.room.upsert({
    where: {
      id: room?.id ?? "0"
    },
    create: {
      created_by: sender_id,
      is_group: false,
      name: "",
      members: {
        createMany: {
          data: [
            {
              user_id: sender_id,
              role_id: owner.id
            },
            {
              user_id: reciver_id,
              role_id: memeber.id
            }
          ]
        }
      }
    },
    update: {}
  });
};
