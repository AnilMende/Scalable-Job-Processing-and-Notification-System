import { response } from "express";
import { Job } from "../models/jobModel.js";
import { createJobService } from "../services/job.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { jobQueue } from "../queues/job.queue.js";


export const createJob = asyncHandler(async (req, res) => {

    //checking queue size
    const waiting = await jobQueue.getWaitingCount();
    const active = await jobQueue.getActiveCount();

    //const queueSize = waiting + active;
    //this is the backpressure control
    if (waiting > 150 || active > 50) {
        return res.status(429).json({
            message: "Server busy"
        });
    }

    console.log({ waiting, active});


    const job = await createJobService(req.user._id);

    console.log("API HIT Created Job");

    return res.status(200).json(
        new ApiResponse(200, job, "Job Created Successfully")
    );
});


export const getAllJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find().sort({ createdAt : -1}).limit(10);

    return res.status(200).json(
        new ApiResponse(200, jobs, "Jobs Fetched")
    );
})

//For Observability -> get queue stats
export const getQueueStats = asyncHandler(async (req, res) => {
    
    
    const counts = await jobQueue.getJobCounts(
        'waiting',
        'active',
        'completed',
        'failed',
        'delayed',
    );

    const data = {
        waiting : counts.waiting,
        active : counts.active,
        delayed : counts.delayed,
        completed : counts.completed,
        failed : counts.failed,
        totalPending : counts.waiting + counts.active + counts.delayed
    };

    return res.status(200).json(
        new ApiResponse(200, data, "Queue stats fetched successfully")
    );
});
