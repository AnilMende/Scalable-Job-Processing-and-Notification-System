import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

import { ApiError } from "../utils/ApiError.js";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new ApiError("REDIS_URL is not defined in environment variables");
}

const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    tls: redisUrl.startsWith("rediss://")
        ? { rejectUnauthorized: false }
        : undefined
});

connection.on("connect", () => {
    console.log("Connected to Redis");
})

connection.on("error", (err) => {
    console.error("Redis Error:", err);
})

export default connection;