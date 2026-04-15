import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";


const app = express();

app.use(express.json());

app.use(cors({
    origin : "*",
    methods : ["GET", "PUT", "POST", "PATCH", "UPDATE", "DELETE"]
}));

const PORT = process.env.PORT || 5000;

// MongoDB connection
await connectDB();


// Api End Points

// Auth Api Endpoint
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Server started running at PORT:${PORT}`));