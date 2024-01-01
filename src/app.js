import express from 'express';
import cors from 'cors'
import { userRoute } from './routes/user.routes.js';
const app=express();
app.use(cors({
    origin: process.env.CORS_URL
}))
app.use(express.json({
    limit:"16kb"
}));

app.use(express.urlencoded({extended:true,limit:"16kb"}));

app.use(express.static("public"));

app.use("/users",userRoute);


export {
    app
}