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
      callback(null, true);
    } else {
      callback(null, false);
    }
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

groupRoutes.get("/groups", verifyToken, groupController.getDiscoverGroups);

groupRoutes.get("/peoples", verifyToken, groupController.getDiscoverPeoples);

groupRoutes.post("/groups/free", verifyToken, uploadPhoto.single("photo"), groupController.createFreeGroup);
groupRoutes.put("/groups/free/:groupId", verifyToken, uploadPhoto.single("photo"), groupController.updateFreeGroup);

groupRoutes.post(
  "/groups/paid",
  verifyToken,
  uploadPhotoPaid.fields([{ name: "photo", maxCount: 1 }, { name: "assets" }]),
  groupController.createPaidGroup
);
groupRoutes.put(
  "/groups/paid/:groupId",
  verifyToken,
  uploadPhotoPaid.fields([{ name: "photo", maxCount: 1 }, { name: "assets" }]),
  groupController.updatePaidGroup
);

export default groupRoutes;
