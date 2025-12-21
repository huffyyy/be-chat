import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as groupRepositories from "../repositories/groupRepositories";

export const createFreeGroup = async (data: GroupFreeValues, photo: string, userId: string) => {
  const group = await groupRepositories.createGroup(data, photo, userId);

  return group;
};

export const createPaidGroup = async (data: GroupPaidValues, photo: string, userId: string, assets?: string[]) => {
  const group = await groupRepositories.createPaidGroup(data, photo, userId, assets);

  return group;
};
