import * as groupRepositories from "../repositories/groupRepositories";
import * as userRepositories from "../repositories/userRepositories";
import * as transactionRepositories from "../repositories/transactionRepositories";
import { withdrawValues } from "../utils/schema/transaction";

export const createTransaction = async (groupId: string, userId: string) => {
  const checkMember = await groupRepositories.getMemberById(userId, groupId);

  if (checkMember) {
    throw new Error("You Already joined group");
  }

  const group = await groupRepositories.findGroupById(groupId);

  if (group.type === "FREE") {
    throw new Error("This group is free");
  }

  const user = await userRepositories.getUserById(userId);

  const transaction = await transactionRepositories.createTransaction({
    price: group.price,
    owner: {
      connect: {
        id: group.room.members[0].user_id
      }
    },
    user: {
      connect: {
        id: userId
      }
    },
    type: "PENDING",
    group: {
      connect: {
        id: groupId
      }
    }
  });

  const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? "";
  const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? "";

  const midtransResponse = await fetch(midtransUrl, {
    method: "POST",
    body: JSON.stringify({
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.price
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        email: user.email
      }
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${midtransAuth}`
    }
  });
  const midtransJson = await midtransResponse.json();

  return midtransJson;
};

export const updateTransaction = async (order_id: string, status: string) => {
  switch (status) {
    case "capture":
    case "settlement": {
      const transaction = await transactionRepositories.updateTransaction(order_id, "SUCCESS");
      const group = await groupRepositories.findGroupById(transaction.group_id);

      await groupRepositories.addMemberFreeGroup(group.room_id, transaction.user_id);

      return { transaction_id: transaction.id };
    }

    case "deny":
    case "expire":
    case "failed": {
      const transaction = await transactionRepositories.updateTransaction(order_id, "FAILED");

      return { transaction_id: transaction.id };
    }

    default:
      return {};
  }
};

export const getBalance = async (user_id: string) => {
  const transaction = await transactionRepositories.getMyTransaction(user_id);
  const payout = await transactionRepositories.getMyPayouts(user_id);

  const totalRevenue = transaction.reduce((acc, curr) => {
    if (curr.type === "SUCCESS") {
      return acc + curr.price;
    }

    return acc;
  }, 0);

  const totalPayout = payout.reduce((acc, curr) => acc + curr.amount, 0);

  return totalRevenue - totalPayout;
};

export const getRevenueStat = async (user_id: string) => {
  const transaction = await transactionRepositories.getMyTransaction(user_id);
  const payout = await transactionRepositories.getMyPayouts(user_id);
  const groups = await groupRepositories.getMyOwnGroups(user_id);

  const totalRevenue = transaction.reduce((acc, curr) => {
    if (curr.type === "SUCCESS") {
      return acc + curr.price;
    }

    return acc;
  }, 0);

  const totalPayout = payout.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalRevenue - totalPayout;

  const totalVipGroups = groups.filter((group) => group.type === "PAID").length;
  const totalVipMembers = groups.reduce((acc, curr) => {
    if (curr.type === "PAID") {
      return acc + (curr?.room?._count?.members ?? 0);
    }

    return acc;
  }, 0);

  const latestMemberVip = transaction.filter((transaction) => transaction.type === "SUCCESS");

  return {
    balance,
    total_vip_groups: totalVipGroups,
    total_vip_members: totalVipMembers,
    total_revenue: totalRevenue,
    latest_members: latestMemberVip
  };
};

export const getHistoryPayouts = async (user_id: string) => {
  return await transactionRepositories.getMyPayouts(user_id);
};

export const createWithdraw = async (data: withdrawValues, user_id: string) => {
  const balance = await getBalance(user_id);

  if (balance < data.amount) {
    throw new Error("Failed to create withdraw : Insufficient balance");
  }

  return await transactionRepositories.createWithdraw(data, user_id);
};
