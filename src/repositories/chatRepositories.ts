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

export const getRooms = async (userId: string) => {
  return await prisma.room.findMany({
    where: {
      members: {
        some: {
          user_id: userId
        }
      }
    },
    include: {
      messages: {
        select: {
          content: true,
          user: {
            select: {
              name: true,
              photo_url: true
            }
          }
        },
        take: 1,
        orderBy: {
          created_at: "desc"
        }
      },
      members: {
        select: {
          user: {
            select: {
              name: true,
              photo_url: true
            }
          }
        },
        where: {
          role: {
            role: "MEMBER"
          }
        }
      },
      group: {
        select: {
          name: true,
          photo_url: true
        }
      }
    },
    orderBy: {
      created_at: "desc"
    }
  });
};

export const getRoomMessage = async (roomId: string) => {
  return await prisma.room.findFirst({
    where: {
      id: roomId
    },
    select: {
      id: true,
      is_group: true,
      messages: {
        select: {
          content: true,
          type: true,
          user: {
            select: {
              id: true,
              name: true,
              photo_url: true
            }
          },
          created_at: true
        },
        orderBy: {
          created_at: "desc"
        }
      },
      group: {
        select: {
          name: true,
          photo_url: true
        }
      },
      members: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              photo_url: true
            }
          }
        }
      }
    }
  });
};
