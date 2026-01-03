import { Prisma, TransactionType } from "@prisma/client";
import prisma from "../utils/prisma";

export const createTransaction = async (data: Prisma.TransactionCreateInput) => {
  return await prisma.transaction.create({
    data
  });
};

export const updateTransaction = async (id: string, type: TransactionType) => {
  return await prisma.transaction.update({
    where: {
      id
    },
    data: {
      type
    }
  });
};
