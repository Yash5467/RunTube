import asynHandler from "../utils/asynHandler.js";
import { ApiErros } from "../utils/ApiErros.js";
import { User } from "../models/user.models.js";
import { uploadFile } from "../utils/FileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { destroyFile } from "../utils/DestroyFile.js";
const options = {
  httpOnly: true,
  secure: true,
};

const userController = asynHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;

  if (
    [userName, email, password, fullName].some((item) => item?.trim() == "")
  ) {
    throw new ApiErros(400, "Fileds are required");
  }
  const emailValidatorJson = await fetch(
    `${process.env.EMAIL_VALIDATOR_URL}?api_key=${process.env.EMAIL_VALIDATOR_API_KEY}&email=${email}`
  );
  const emailValidator = await emailValidatorJson.json();

  if (emailValidator.status === "invalid")
    throw new ApiErros(401, "Invalid Email Address");

  const userNameCheck = await User.findOne({
    userName,
  });

  if (userNameCheck) throw new ApiErros(401, "Username Already Exist");

  const userCheck = await User.findOne({
    $or: [{ userName, email }],
  });

  if (userCheck) throw new ApiErros(400, "User Already Exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  const avatar = avatarLocalPath ? await uploadFile(avatarLocalPath) : "";
  const coverImage = coverImageLocalPath
    ? await uploadFile(coverImageLocalPath)
    : "";
  const userCreation = await User.create({
    userName,
    email,
    password,
    fullName,
    avatar: avatar.url || "",
    coverImage: coverImage.url || "",
  });

  const UserCheck = await User.findById(userCreation._id).select(
    "-password -refreshToken"
  );

  if (userCheck) throw new ApiErros(500, "Error While Creating User");

  res.status(201).json(new ApiResponse(201, UserCheck));
});

const loginUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password))
    throw new ApiErros(401, "email and password are required");

  const user = await User.findOne({ email: email });

  if (!user) throw new ApiErros(401, "User Not found");

  const verifyStatus = await user.isPassCorect(password);

  if (!verifyStatus) throw new ApiErros(401, "password is incorrect");

  const accessToken = user.generateAccesToken();
  const refreshToken = user.generateRefreshToken();
  console.log(user);
  const refreshedUsed = await User.findByIdAndUpdate(user._id, {
    refreshToken: refreshToken,
  }).select("-password -refreshToken");

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, refreshedUsed, "loggedin Succesfully"));
});

const logoutUser = asynHandler(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    refreshToken: undefined,
  });

  res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "logout succes"));
});

const updateEmail = asynHandler(async (req, res) => {
  const { email } = req.body;
  const { _id } = req.user;

  if (email.trim() == "") throw new ApiErros(401, "email id required");

  const user = await User.findById(
    _id,
    {
      $set: {
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  res
    .status(201)
    .json(new ApiResponse(201, user, "Email Id updated succesfully"));
});
const updatePassword = asynHandler(async (req, res) => {
  const { oldPassword, newPassowrd, conformPassword } = req.body;
  if (!newPassowrd || !conformPassword)
    throw new ApiErros(401, "Password Required");

  if (newPassowrd !== conformPassword) throw new ApiErros("Passowrd Mismatch");

  const user = await User.findById(req.user?._id);

  const passCheck = await user.isPassCorect(oldPassword);

  if (!passCheck) throw new ApiErros(401, "Invalid Password");

  user.password = newPassowrd;
  user.save({ validateBeforeSave: false });

  res.status(201).json(201, {}, "Password Updated Succesfully");
});

const updateAvatar = asynHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) throw new ApiErros(401, "Avatar Required");

  const avatar = await uploadFile(avatarLocalPath);

  if (!avatar) throw new ApiErros(500, "Error While Uploading Avatar");

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      avatar,
    },
  }).select("-password -refreshToken");

  await destroyFile(user.avatar);
  user.avatar = avatar;

  req
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated succesfully"));
});

const updateCoverImage = asynHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!coverImageLocalPath) throw new ApiErros(401, "Cover Image Required");

  const coverImage = await uploadFile(coverImageLocalPath);

  if (!coverImage) throw new ApiErros(500, "Error While uploading Cover Image");

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      coverImage,
    },
  }).selected("-password -refreshToken");

  await destroyFile(user.coverImage);
  user.coverImage = coverImage;

  res
    .status(201)
    .json(new ApiResponse(201, user, "CoverImage Updated Succesfully"));
});
export {
  userController,
  loginUser,
  logoutUser,
  updateEmail,
  updatePassword,
  updateAvatar,
  updateCoverImage,
};
