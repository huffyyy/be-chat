import { Response, NextFunction } from "express";
import { groupFreeSchema, groupPaidSchema } from "../utils/schema/group";
import * as groupService from "../services/groupService";
import { CustomRequest } from "../types/customRequest";

export const getDiscoverGroups = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;

    const data = await groupService.getDiscoverGroups((name as string) ?? "");

    return res.json({
      success: true,
      message: "Get discover groups success",
      data
    });
  } catch (error) {
    next(error);
  }
};

export const createFreeGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const parse = groupFreeSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessage
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File photo is required"
      });
    }

    const group = await groupService.upsertFreeGroup(parse.data, req.user?.id ?? "", req.file.filename);

    return res.json({
      success: true,
      message: "Create group success",
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const updateFreeGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;

    const parse = groupFreeSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessage
      });
    }

    const group = await groupService.upsertFreeGroup(parse.data, req.user?.id ?? "", req?.file?.filename, groupId);

    return res.json({
      success: true,
      message: "Update group success",
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const createPaidGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const parse = groupPaidSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: parse.error.issues.map((err) => `${err.path} - ${err.message}`)
      });
    }

    const files = req.files as {
      photo?: Express.Multer.File[];
      assets?: Express.Multer.File[];
    };

    if (!files?.photo || files.photo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File photo is required"
      });
    }

    if (!files.assets || files.assets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File assets is required"
      });
    }

    const photo = files.photo[0].filename;
    const assets = files.assets.map((file) => file.filename);

    const group = await groupService.upsertPaidGroup(parse.data, photo, req.user?.id ?? "", assets);

    return res.json({
      success: true,
      message: "Create group success",
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaidGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;

    const parse = groupPaidSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: parse.error.issues.map((err) => `${err.path} - ${err.message}`)
      });
    }

    const files = req.files as {
      photo?: Express.Multer.File[];
      assets?: Express.Multer.File[];
    };

    const assets = files?.assets?.map((file) => file.filename);

    const group = await groupService.upsertPaidGroup(
      parse.data,
      req.user?.id ?? "",
      files.photo?.[0].filename ?? "",
      assets,
      groupId
    );

    return res.json({
      success: true,
      message: "Update group success",
      data: group
    });
  } catch (error) {
    next(error);
  }
};
