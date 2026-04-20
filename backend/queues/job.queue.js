import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const jobQueue = new Queue("job-queue",
    {
        connection
    });