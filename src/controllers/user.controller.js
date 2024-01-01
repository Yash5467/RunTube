import asynHandler from "../utils/asynHandler.js";
import { ApiErros } from "../utils/ApiErros.js";
import { User } from "../models/user.models.js";
import { uploadFile } from "../utils/FileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userController = asynHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;

  if (
    [userName, email, password, fullName].some((item) => item?.trim() == "")
  ) {
    throw new ApiErros(400, "Fileds are required");
  }

  const userCheck = await User.findOne({
    $or: [{userName,email}],
  });

  if (userCheck) throw new ApiErros(400, "User Already Exists");
 

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  const avatar = avatarLocalPath?await uploadFile(avatarLocalPath):"";
  const coverImage =coverImageLocalPath?await uploadFile(coverImageLocalPath):"";
  const userCreation = await User.create({
    userName,
    email,
    password,
    fullName,
    avatar: avatar.url|| "",
    coverImage: coverImage.url || "",
  });


  const UserCheck = await User.findById(userCreation._id);
console.log(userCheck);
  if (userCheck) throw new ApiErros(500, "Error While Creating User");

  res.status(201).json(new ApiResponse(201, UserCheck));
});

export { userController };
