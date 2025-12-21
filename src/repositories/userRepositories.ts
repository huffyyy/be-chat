import { RoleType } from "@prisma/client";
import prisma from "../utils/prisma";
import { signUpValues } from "../utils/schema/user";
import crypto from "node:crypto";

export const getUserById = async (id: string) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      id
    },
    include: {
      role: true
    }
  });
};

export const isEmailExist = async (email: string) => {
  return await prisma.user.count({
    where: {
      email: email
    }
  });
};

export const findRole = async (role: RoleType) => {
  return await prisma.role.findFirstOrThrow({
    where: {
      role: role
    }
  });
};

export const createUser = async (data: signUpValues, photo: string) => {
  const role = await findRole("USER");

  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      role_id: role.id,
      photo
    }
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: email
    }
  });
};

export const createPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  const token = crypto.randomBytes(32).toString("hex");

  return await prisma.passwordReset.create({
    data: {
      user_id: user.id,
      token
    }
  });
};

export const findResetDataByToken = async (token: string) => {
  return await prisma.passwordReset.findFirst({
    where: {
      token: token
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });
};

export const updatePassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  return await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      password: password
    }
  });
};

export const deleteTokenResetById = async (id: string) => {
  return await prisma.passwordReset.delete({
    where: {
      id
    }
  });
};
