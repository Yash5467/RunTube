import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { upload } from "../middilewares/multer.middileware.js";

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

export { userRoute };
