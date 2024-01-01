import { v2 as cloudinary } from "cloudinary";
import fs from "fs";






const uploadFile = async (localFilePath) => {
   
cloudinary.config({
  api_key:process.env.CLOUDINARY_API_KEY,
  cloud_name:process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
  
  try {

    if (!localFilePath) return null;

    let response = await cloudinary.uploader.upload(localFilePath,{
       resource_type:'auto'
    },);
    console.log(response.url);

    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    console.log("Error Occured in Cloudinary", error);
    fs.unlinkSync(localFilePath)
    throw error;
   
  } 
};


export {
    uploadFile
}