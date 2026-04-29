// import dotenv from "dotenv";
// dotenv.config();
import connectDB from "../config/db.js";

await connectDB();

import { Worker } from "bullmq";
import { Job } from "../models/jobModel.js";
import { getRedisClient } from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";

import { createClient } from "redis";

const pub = createClient({
    url : process.env.REDIS_URL
});


await pub.connect();

const connection = await getRedisClient();

console.log("Worker Started");

const worker = new Worker(
    "job-queue",
    async (job) => {
        console.log(`Processing Job ${job.id} on PID ${process.pid}`);

        //mark processing
        await Job.findByIdAndUpdate(job.data.jobId, {
            status: "processing"
        });

        //Publish processing event
        await pub.publish("job-updates", JSON.stringify({
            jobId : job.data.jobId,
            status : "processing"
        }));


        try {

            //simulate the work
            await new Promise((res) => setTimeout(res, 300));

            await Job.findByIdAndUpdate(job.data.jobId, {
                status: "completed",
                result: "Job processed successfully",
            });

            //Publishing update event
            await pub.publish("job-updates", JSON.stringify({
                jobId : job.data.jobId,
                status : "completed"
            }));

            console.log(`Job Completed ${job.id} on PID ${process.pid}`);

        } catch (error) {

            console.log("Job attempt failed", job.id);

            //update attempts
            await Job.findByIdAndUpdate(job.data.jobId, {
                status: "failed",
                failedReason: error.message,
                $inc: { attempts: 1 },
                isQueued: false
            })

            //Publsih failed event
            await pub.publish("job-updates", JSON.stringify({
                jobId : job.data.jobId,
                status : "failed"
            }));

            //throw error so BullMq retries
            throw error;
        }

    },
    {
        connection : {
            url : process.env.REDIS_URL
        },
        concurrency: 10

    }
);

// BullMQ emits event when job fails permanently
worker.on("failed", async (job, err) => {
    console.log("Job permanently failed:", job.id);

    //move to failed state in DB
    await Job.findByIdAndUpdate(job.data.jobId, {
        status: "failed",
        failedReason: err.message
    });
});

// DB Life-Cycle: 
//On Success : pending -> processing -> completed
//On Failure : pending -> processing -> failed -> retry

export default worker;