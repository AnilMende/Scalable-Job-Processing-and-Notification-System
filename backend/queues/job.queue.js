import { Queue } from "bullmq";
import { getRedisClient } from "../config/redis.js";

const connection = await getRedisClient();

export const jobQueue = new Queue("job-queue",
    {
        connection : {
            host : "127.0.0.1",
            port : 6379
        }
    });