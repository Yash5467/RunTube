import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    console.log(process.env.MONGODB_URL)
    const mongoInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log("DB CONNECTED : ", mongoInstance.connection.host);
  } catch (error) {
    console.log("ERROR DB NOT CONNECTED", error);
  }
};


export default  connectDb;