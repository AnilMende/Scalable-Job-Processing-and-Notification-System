import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";

await connectDB();

import { Worker } from "bullmq";
import { Job } from "../models/jobModel.js";
import connection from "../config/redis.js";


const worker = new Worker(
    "job-queue",
    async (job) => {
        console.log("Processing Job", job.id, job.data);

        await Job.findByIdAndUpdate(job.data.jobId, {
            status: "processing"
        });

        await new Promise((res) => setTimeout(res, 2000));

        await Job.findByIdAndUpdate(job.data.jobId, {
            status: "completed"
        });

        console.log("Job Completed", job.id);

    },
    { connection }
);

// DB Life-Cycle: 
//On Success : pending -> processing -> completed
//On Failure : pending -> processing -> failed -> retry

export default worker;