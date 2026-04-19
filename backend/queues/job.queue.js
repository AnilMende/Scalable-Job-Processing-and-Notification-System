import { Queue } from "bullmq";

export const jobQueue = new Queue("job-queue", {
    connection
});