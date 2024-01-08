import { ApiErros } from "./ApiErros.js";
import { uploadFile } from "./FileUpload.js";
import asynHandler from "./asynHandler.js";


const destroyFile=asynHandler(async(publicUrl)=>
{
      if(!publicUrl) throw new Error("public url required");
        return  await uploadFile.uploader.destroy(publicUrl);
});

export {
    destroyFile
}