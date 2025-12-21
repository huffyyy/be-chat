import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as userRepositories from "../repositories/userRepositories";
import prisma from "../utils/prisma";

export const createGroup = async (data: GroupFreeValues, photo: string, userId: string) => {
  const owner = await userRepositories.findRole("OWNER");

  return await prisma.group.create({
    data: {
      photo,
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
    }
  });
};

export const createPaidGroup = async (data: GroupPaidValues, photo: string, userId: string, assets?: string[]) => {
  const owner = await userRepositories.findRole("OWNER");

  const group = await prisma.group.create({
    data: {
      photo,
      name: data.name,
      about: data.about,
      price: Number.parseInt(data.price),
      benefit: data.benefit,
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
