import { ApiErros } from "./ApiErros";
import { uploadFile } from "./FileUpload";
import asynHandler from "./asynHandler";


const destroyFile=asynHandler(async(publicUrl)=>
{
      if(!publicUrl) throw new Error("public url required");
        return  await uploadFile.uploader.destroy(publicUrl);
});

export {
    destroyFile
}