import { Job } from "../models/jobModel.js"
import { jobQueue } from "../queues/job.queue.js";


export const createJobService = async (userId) => {

    console.log("Creating job in DB...");
    const job = await Job.create({
        userId,
        status: "pending",
        isQueued: false
    });


    //adding job to the queue
    await jobQueue.add("process-job",
        { jobId: job._id },
        {
            jobId : job._id.toString(),
            //total tries for a failed process
            attempts: 3,
            backoff: {
                type: "exponential",
                //delay is exponential on first try it will be 2s then 4s then 8s
                delay: 2000
            },
            //job will be remove on it's completion
            removeOnComplete: true,
            //keep failed jobs
            removeOnFail: false
        }
    );

    console.log("Job added to queue: ", job._id);

    return job;
};