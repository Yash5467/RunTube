import asynHandler from "../utils/asynHandler.js";
import { ApiErros } from "../utils/ApiErros.js";
import { User } from "../models/user.models.js";
import { uploadFile } from "../utils/FileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

const logoutUser = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    refreshToken: undefined,
  });

  res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "logout succes"));
};

export { userController, loginUser,logoutUser };
