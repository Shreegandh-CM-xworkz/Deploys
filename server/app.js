import express, { urlencoded }  from "express";
import dotenv from "dotenv";
import {connectPassport} from "./utils/Provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app=express();
export default app;



//to connect dotenv
dotenv.config({
    path:"./config/config.env"
});

// using middelwares
 app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:process.env.NODE_ENV==="development"?false : true,
        httpOnly:process.env.NODE_ENV==="development"?false : true,
        sameSite:process.env.NODE_ENV==="development"?false : "none",
    }
 }))
 //important after session
 // in console we get undefined for cookiee so using cookie parser
 app.use(cookieParser());

 app.use(express.json());
 app.use(urlencoded(
     {
    extended:true
 }
 ))

 app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE"],
 }))
 app.use(passport.authenticate("session"));  
 app.use(passport.initialize());
 app.use(passport.session());
 
 //before deplyoment 
 app.enable("trust proxy");

//we should call before route and after config
connectPassport();
  
// importing routes

import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);

//last  using errorhandler

app.use(errorMiddleware);