import dotenv from 'dotenv'

import connectDb from "./db/index.js";
import { app } from './app.js';

dotenv.config(
    {
        path:"./.env"
    }
);

connectDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("App is running at port",process.env.PORT);
    })
}).catch((err)=>{
 console.log(err);
})

