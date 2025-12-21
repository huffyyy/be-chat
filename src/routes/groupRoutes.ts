import express from "express";
import multer from "multer";
import { storageGroupPaidPhoto, storageGroupPhoto } from "../utils/multer";
import verifyToken from "../middleware/verifyToken";
import * as groupController from "../controllers/groupController";

const groupRoutes = express.Router();

const uploadPhoto = multer({
  storage: storageGroupPhoto,
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, false);
    }
    callback(null, true);
  }
});

const uploadPhotoPaid = multer({
  storage: storageGroupPaidPhoto
  //   fileFilter(req, file, callback) {
  //     if (file.fieldname === "assets") {
  //       callback(null, true);
  //       return;
  //     }

  //     if (file.mimetype.startsWith("image/")) {
  //       callback(null, false);
  //     }
  //     callback(null, true);
  //   }
});

groupRoutes.post("/groups/free", verifyToken, uploadPhoto.single("photo"), groupController.createFreeGroup);
groupRoutes.post(
  "/groups/paid",
  verifyToken,
  uploadPhotoPaid.fields([{ name: "photo", maxCount: 1 }, { name: "assets" }]),
  groupController.createPaidGroup
);

export default groupRoutes;
