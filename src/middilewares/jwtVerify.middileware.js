import { User } from "../models/user.models.js";
import { ApiErros } from "../utils/ApiErros.js";
import asynHandler from "../utils/asynHandler.js";
import Jwt from "jsonwebtoken";

const verfiyJWT = asynHandler(async (req, res, next) => {
  const accessToken=req.cookies?.accessToken;
  const refreshToken=req.cookies?.refreshToken;

  if (!(accessToken && refreshToken))
    throw new ApiErros(401, "unauthorized access");
  const decreptedUser = Jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  if (!decreptedUser) throw new ApiErros(401, "unauthorized access");

  const user = await User.findById(decreptedUser._id);

  if (!user) throw new ApiErros(401, "invalid tokens");

  req.user = user;

  next();
});


export {
    verfiyJWT
}
