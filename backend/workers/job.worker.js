import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";

await connectDB();

import { Worker } from "bullmq";
import { Job } from "../models/jobModel.js";
import connection from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";


const worker = new Worker(
    "job-queue",
    async (job) => {
        console.log("Processing Job", job.id, job.data);

        //mark processing
        await Job.findByIdAndUpdate(job.data.jobId, {
            status: "processing"
        });

        try {
            //simualte random failure
            if (Math.random() < 0.5) {
                throw new ApiError("Random job failure");
            }

            //simulate the work
            await new Promise((res) => setTimeout(res, 2000));

            await Job.findByIdAndUpdate(job.data.jobId, {
                status: "completed",
                result: "Job processed successfully"
            });

            console.log("Job Completed", job.id);

        } catch (error) {

            console.log("Job attempt failed", job.id);

            //update attempts
            await Job.findByIdAndUpdate(job.id.jobId, {
                $inc: { attempts: 1 },
                failedReason: error.message
            })

            //throw error so BullMq retries
            throw error;
        }

    },
    { connection }
);

// BullMQ emits event when job fails permanently
worker.on("failed", async (job, err) => {
    console.log("Job permanently failed:", job.id);

    //move to failed state in DB
    await Job.findByIdAndUpdate(job.data.jobId, {
        status : "failed",
        failedReason : err.message
    });
});

// DB Life-Cycle: 
//On Success : pending -> processing -> completed
//On Failure : pending -> processing -> failed -> retry

export default worker;