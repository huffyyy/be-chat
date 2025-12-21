import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as groupRepositories from "../repositories/groupRepositories";
import path from "node:path";
import fs from "node:fs";

export const upsertFreeGroup = async (data: GroupFreeValues, userId: string, photo?: string, groupId?: string) => {
  if (groupId && photo) {
    const group = await groupRepositories.findGroupById(groupId);

    const pathPhoto = path.join(__dirname, "../../public/assets/uploads/groups", group.photo);

    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto);
    }
  }

  const group = await groupRepositories.upsetFreeGroup(data, userId, photo);

  return group;
};

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  photo: string,
  userId: string,
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
