import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

let redisClient;

export const getRedisClient = async () => {
    if (!redisClient) {

        const isTLS = process.env.REDIS_URL.startsWith("rediss://");

        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: isTLS
                ? {
                      tls: true,
                      rejectUnauthorized: false
                  }
                : {}
        });

        redisClient.on("error", (err) => {
            console.log("Redis Error:", err);
        });

        await redisClient.connect();

        console.log("Connected to Redis");
    }

    return redisClient;
};