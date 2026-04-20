import { Job } from "../models/jobModel.js"
import { jobQueue } from "../queues/job.queue.js";


export const createJobService = async (userId) => {

    console.log("Creating job in DB...");
    const job = await Job.create({
        userId,
        status : "pending"
    });

    //adding job to the queue
    await jobQueue.add("process-job", {
        jobId : job._id
    });

    console.log("Job added to queue: ", job._id);

    return job;
};