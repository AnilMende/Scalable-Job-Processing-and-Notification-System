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
        new ApiResponse(200, "Job Created Successfully", job)
    );
});


export const getAllJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find();

    return res.status(200).json(
        new ApiResponse(200, "All jobs fetched successfully", jobs)
    );
})
