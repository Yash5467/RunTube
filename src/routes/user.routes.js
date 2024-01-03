import { Router } from "express";
import {
  loginUser,
  logoutUser,
  userController,
} from "../controllers/user.controller.js";
import { upload } from "../middilewares/multer.middileware.js";
import { verfiyJWT } from "../middilewares/jwtVerify.middileware.js";

const userRoute = Router();

userRoute.route("/register").post(
  upload.fields([
    {
      name: "avatar",
    },
    {
      name: "coverImage",
    },
  ]),
  userController
);

userRoute.route("/login").post(loginUser);

userRoute.route("/logout").post(verfiyJWT, logoutUser);

export { userRoute };
