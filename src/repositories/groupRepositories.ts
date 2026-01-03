import prisma from "../utils/prisma";
import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as userRepositories from "../repositories/userRepositories";

export const getDiscoverGroups = async (name = "") => {
  return await prisma.group.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive"
      }
    },
    select: {
      photo_url: true,
      id: true,
      name: true,
      about: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              members: true
            }
          }
        }
      }
    }
  });
};

export const getDiscoverPeople = async (name = "", userId?: string) => {
  return await prisma.user.findMany({
    where: {
      id: {
        not: userId
      },
      name: {
        contains: name,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      name: true,
      photo_url: true
    }
  });
};

export const findGroupById = async (id: string) => {
  const group = await prisma.group.findFirst({
    where: {
      id
    },
    include: {
      room: {
        select: {
          members: {
            include: {
              role: true
            },
            where: {
              role: {
                role: "OWNER"
              }
            }
          }
        }
      }
    }
  });

  if (!group) {
    throw new Error("GROUP_NOT_FOUND");
  }

  return group;
};

export const upsetFreeGroup = async (data: GroupFreeValues, userId: string, photo?: string, groupId?: string) => {
  const owner = await userRepositories.findRole("OWNER");

  return await prisma.group.upsert({
    where: {
      id: groupId ?? ""
    },
    create: {
      photo: photo ?? "",
      name: data.name,
      about: data.about,
      price: 0,
      type: "FREE",
      room: {
        create: {
          created_by: userId,
          name: data.name + "Room",
          members: {
            create: {
              user_id: userId,
              role_id: owner.id
            }
          },
          is_group: true
        }
      }
    },
    update: {
      photo,
      name: data.name,
      about: data.about
    }
  });
};

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo?: string,
  assets?: string[],
  groupId?: string
) => {
  const owner = await userRepositories.findRole("OWNER");

  const group = await prisma.group.upsert({
    where: {
      id: groupId ?? ""
    },
    create: {
      photo: photo ?? "",
      name: data.name,
      about: data.about,
      price: Number.parseInt(data.price),
      benefit: data.benefit,
      type: "PAID",
      room: {
        create: {
          created_by: userId,
          name: data.name + "Room",
          members: {
            create: {
              user_id: userId,
              role_id: owner.id
            }
          },
          is_group: true
        }
      }
    },
    update: {
      photo,
      name: data.name,
      about: data.about,
      price: Number.parseInt(data.price),
      benefit: data.benefit,
      type: "PAID"
    }
  });

  if (assets) {
    for (const asset of assets) {
      await prisma.groupAsset.create({
        data: {
          filename: asset,
          group_id: group.id
        }
      });
    }
  }
  return group;
};

export const findDetailGroup = async (id: string, userId: string) => {
  const group = await prisma.group.findFirst({
    where: {
      id,
      OR: [
        {
          room: {
            created_by: userId
          }
        },
        {
          room: {
            members: {
              some: {
                user_id: userId
              }
            }
          }
        },
        {
          type: "FREE"
        }
      ]
    },
    select: {
      id: true,
      name: true,
      photo: true,
      about: true,
      type: true,
      assets: {
        select: {
          filename: true
        }
      },
      room: {
        select: {
          members: {
            take: 1,
            where: {
              user_id: userId
            },
            select: {
              user: {
                select: {
                  name: true,
                  photo_url: true
                }
              }
            }
          },
          _count: {
            select: {
              members: true
            }
          }
        }
      }
    }
  });

  if (!group) {
    throw new Error("GROUP_NOT_FOUND_OR_NOT_ACCESSIBLE");
  }

  return group;
};

export const getMyOwnGroups = async (userId: string) => {
  return await prisma.group.findMany({
    where: {
      room: {
        created_by: userId
      }
    },
    select: {
      id: true,
      photo_url: true,
      name: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              members: true
            }
          },
          id: true
        }
      }
    }
  });
};

export const getTotalMembers = async (roomIds: string[]) => {
  return await prisma.roomMember.count({
    where: {
      room_id: {
        in: roomIds
      }
    }
  });
};

export const getMemberById = async (userId: string, roomId: string) => {
  return await prisma.roomMember.findFirst({
    where: {
      user_id: userId,
      room_id: roomId
    }
  });
};

export const addMemberFreeGroup = async (roomId: string, userId: string) => {
  const role = await userRepositories.findRole("MEMBER");

  return await prisma.roomMember.create({
    data: {
      room_id: roomId,
      user_id: userId,
      role_id: role.id
    }
  });
};

export const findRoomById = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { created_by: true }
  });

  if (!room) {
    throw new Error("ROOM_NOT_FOUND");
  }

  return room;
};

export const findAssetGroup = async (assetId: string) => {
  return await prisma.groupAsset.findFirstOrThrow({
    where: {
      id: assetId
    }
  });
};

export const deleteAssetGroup = async (assetId: string) => {
  return await prisma.groupAsset.delete({
    where: {
      id: assetId
    }
  });
};
