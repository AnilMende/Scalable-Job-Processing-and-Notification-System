import { Worker } from "bullmq";
import { Job } from "../models/jobModel.js";

const worker = new Worker(
    "job-queue",
    async (job) => {
        console.log("Processing Job", job.id);

        //simulate the work
        await new Promise((res) => setTimeout(res, 2000));

        await Job.findByIdAndUpdate(job.data.userId, {
            status : "completed"
        });
    },
    { connection }
);

export default worker;