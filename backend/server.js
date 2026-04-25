import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import syncPendingJobs from "./utils/syncPendingJobs.js";

import { Server } from "socket.io";
import { createClient } from "redis";
import { subscribe } from "diagnostics_channel";


const app = express();

const server = http.createServer(app);

// ✅ Apply CORS to Express (VERY IMPORTANT)
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

// Socket connection logs
io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    })
})


//redis subscriber setup
const sub = createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379
    }
});

//Redis error handling
sub.on("error", (err) => {
    console.error("Redis Subscriber error", err)
});

// Subscribe to job updates
const setupSubscriber = async () => {
    await sub.connect();

    await sub.subscribe("job-updates", (message) => {
        try {

            const data = JSON.parse(message);

            //emit to frontend
            io.emit("job-update", data);

        } catch (error) {
            console.error("Invalid message format:", message);
        }
    })
}

// API Routes
// Auth Api 
app.use("/api/auth", authRouter);

// Jobs Api
app.use("/api/jobs", jobRouter);

// Server setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        await setupSubscriber();

        await syncPendingJobs();

        server.listen(PORT, () => {
            console.log(`Server started at PORT:${PORT}`)
        });

    } catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
}

startServer();

//Exporting for future use
export { io };
