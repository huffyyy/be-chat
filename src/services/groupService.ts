import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as groupRepositories from "../repositories/groupRepositories";
import path from "node:path";
import fs from "node:fs";

export const getDiscoverGroups = async (name?: string) => {
  return await groupRepositories.getDiscoverGroups(name);
};

export const getDiscoverPeoples = async (name?: string, userId?: string) => {
  return await groupRepositories.getDiscoverPeople(name, userId);
};

export const findDetailGroup = async (id: string, userId: string) => {
  return await groupRepositories.findDetailGroup(id, userId);
};

export const upsertFreeGroup = async (data: GroupFreeValues, userId: string, photo?: string, groupId?: string) => {
  if (groupId && photo) {
    const group = await groupRepositories.findGroupById(groupId);

    const pathPhoto = path.join(__dirname, "../../public/assets/uploads/groups", group.photo);

    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto);
    }
  }

  const group = await groupRepositories.upsetFreeGroup(data, userId, photo, groupId);

  return group;
};

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo: string,
  assets?: string[],
  groupId?: string
) => {
  if (groupId && photo) {
    const group = await groupRepositories.findGroupById(groupId);

    const pathPhoto = path.join(__dirname, "../../public/assets/uploads/groups", group.photo);

    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto);
    }
  }

  const group = await groupRepositories.upsertPaidGroup(data, userId, photo, assets, groupId);

  return group;
};

export const getMyOwnGroups = async (userId: string) => {
  const groups = await groupRepositories.getMyOwnGroups(userId);

  const paidGroups = groups.filter((item) => {
    return item.type === "PAID";
  }).length;

  const freeGroups = groups.filter((item) => {
    return item.type === "FREE";
  }).length;

  const totalMembers = await groupRepositories.getTotalMembers(groups.map((item) => item.room.id));

  return {
    lists: groups.map((item) => {
      return {
        id: item.id,
        photo_url: item.photo_url,
        name: item.name,
        type: item.type,
        total_members: item.room._count.members
      };
    }),
    paid_groups: paidGroups,
    free_groups: freeGroups,
    total_members: totalMembers
  };
};
