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

    if (waiting > 150 || active > 80) {
        return res.status(429).json({
            success: false,
            message: "Server busy"
        });
    }

    console.log("Queue:", { waiting, active });

    const job = await createJobService(req.user._id);

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
