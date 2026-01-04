import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import * as chatService from "../services/chatService";
import { createRoomPersonalSchema } from "../utils/schema/chat";

export const createRoomPersonal = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const parse = createRoomPersonalSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessage
      });
    }

    const data = await chatService.createRoomPersonal(req?.user?.id ?? "", parse.data.user_id);

    return res.json({
      success: true,
      message: "Success create room",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const data = await chatService.getRecentRoom(req?.user?.id ?? "");

  return res.json({
    success: true,
    message: "Success get rooms",
    data
  });
};
