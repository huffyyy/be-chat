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

export default userRoutes;
