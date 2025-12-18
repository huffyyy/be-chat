import express from "express";
import multer from "multer";
import { storageUserPhoto } from "../utils/multer";
import * as userContoller from "../controllers/userController";

const userRoutes = express.Router();

const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, false);
    }
    callback(null, true);
  }
});

userRoutes.post("/auth/sign-up", uploadPhoto.single("photo"), userContoller.signUp);
userRoutes.post("/auth/sign-in", userContoller.signIn);
userRoutes.post("/auth/reset-password", userContoller.getEmailReset);

userRoutes.put("/auth/reset-password/:tokenId", userContoller.updatePassword);

export default userRoutes;
