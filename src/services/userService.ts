import { signUpValues, signInValues, resetPasswordValues } from "../utils/schema/user";
import * as userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailtrap from "../utils/mailtrap";
import { accessSync } from "node:fs";

export const signUp = async (data: signUpValues, file: Express.Multer.File) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);
  if (isEmailExist > 1) {
    throw new Error("Email Alerdy taken");
  }

  const user = await userRepositories.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 12)
    },
    file.filename
  );

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "100 days"
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token
  };
};

export const signIn = async (data: signInValues) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);
  if (isEmailExist === 0) {
    throw new Error("Email not registed");
  }
  const user = await userRepositories.findUserByEmail(data.email);

  if (!bcrypt.compareSync(data.password, user.password)) {
    throw new Error("Email & Password incorrect");
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "100 days"
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token
  };
};

export const getEmailReset = async (email: string) => {
  const data = await userRepositories.createPasswordReset(email);

  await mailtrap.testing.send({
    from: {
      email: "hus@test.com",
      name: "Hus"
    },
    to: [{ email: email }],
    subject: "Reset Password",
    text: `Here is the link to reset your password ${data.token}` // link ke halaman FE untuk reset password
  });
  return true;
};

export const updatePassword = async (data: resetPasswordValues, token: string) => {
  const tokenData = await userRepositories.findResetDataByToken(token);

  if (!tokenData) {
    throw new Error("Token Reset invalid");
  }
  await userRepositories.updatePassword(tokenData.user.email, bcrypt.hashSync(data.password, 12));

  await userRepositories.deleteTokenResetById(tokenData.id);

  return true;
};
