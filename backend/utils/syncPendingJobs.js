import { Job } from "../models/jobModel.js";
import { jobQueue } from "../queues/job.queue.js";
import { asyncHandler } from "./AsyncHandler.js";

const syncPendingJobs = async () => {

    //find all the pending and failed jobs
    const pendingJobs = await Job.find({
        status: { $in: ["pending", "failed"] },
        isQueued: false
    });

    console.log(`Syncing ${pendingJobs.length} jobs to queue`);

    //now add each of the item from the pendingJobs to the jobqueue
    for (const job of pendingJobs) {
        await jobQueue.add("process-job", {
            jobId: job._id
        });

        await Job.findByIdAndUpdate(job._id, {
            isQueued: true
        })
    }
}

export default syncPendingJobs;