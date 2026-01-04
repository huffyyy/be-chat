import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { joinFreeGroup } from "../utils/schema/group";
import * as transactionService from "../services/transactionService";

export const createTransaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const parse = joinFreeGroup.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessage
      });
    }

    const data = await transactionService.createTransaction(parse.data.group_id, req.user?.id ?? "");

    return res.json({
      success: true,
      message: "Succes create transaction ",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.updateTransaction(req.body.order_id, req.body.transaction_status);

    return res.json({
      success: true,
      message: "Success update transaction",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueStat = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.getRevenueStat(req.user?.id ?? "");

    return res.json({
      success: true,
      message: "Success get revenue stat",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getHistoryPayouts = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.getHistoryPayouts(req.user?.id ?? "");

    return res.json({
      success: true,
      message: "Success get history payouts",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getBalance = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.getBalance(req.user?.id ?? "");

    return res.json({
      success: true,
      message: "Success get balance",
      data
    });
  } catch (error) {
    next(error);
  }
};
