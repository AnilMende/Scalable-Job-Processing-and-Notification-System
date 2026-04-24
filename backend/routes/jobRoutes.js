import express from "express";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getQueueStats } from "../controllers/jobController.js";

const jobRouter = express.Router();


jobRouter.post("/create-job",verifyAccessToken, createJob);

jobRouter.get("/all-jobs", verifyAccessToken, getAllJobs);

jobRouter.get("/queue-stats", verifyAccessToken, getQueueStats);

export default jobRouter;