import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectToDb } from "./config/db.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import userRouter from "./routes/user.js"

dotenv.config();
connectToDb();

const app=express();

app.use(express.json());
app.use(cors());

// הוספת השורה להגשת קבצים סטטיים מתיקיית public
app.use(express.static('public'));

app.use("/api/product",productRouter);
app.use("/api/user",userRouter);
app.use("/api/order",orderRouter);

const port=process.env.PORT;
app.listen(port,()=>{console.log("app is listening on port "+port)})