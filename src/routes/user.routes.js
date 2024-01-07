import { Router } from "express";
import {
  loginUser,
  logoutUser,
  updateAvatar,
  updateCoverImage,
  updateEmail,
  updatePassword,
  userController,
} from "../controllers/user.controller.js";
import { upload } from "../middilewares/multer.middileware.js";
import { verfiyJWT } from "../middilewares/jwtVerify.middileware.js";

const userRoute = Router();
// #Unsecured Routes
// sign-up route
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

// login route
userRoute.route("/login").post(loginUser);

// #Secured Routes
//logout route
userRoute.route("/logout").post(verfiyJWT, logoutUser);
//*data updating route
// email route
userRoute.route("/update-email").patch(verfiyJWT, updateEmail);
// password route
userRoute.route("/update-password").patch(verfiyJWT, updatePassword);
// avatar route
userRoute.route("/update-avatar").patch(
  verfiyJWT,
  upload.single({
    name: "avatar",
  }),
  updateAvatar
);
// coverImage route
userRoute.route("/update-coverimage").patch(
  verfiyJWT,
  upload.single({
    name: "coverImage",
  }),
  updateCoverImage
);

export { userRoute };
