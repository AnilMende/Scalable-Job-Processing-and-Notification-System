import express from "express";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();


jobRouter.post("/create-job",verifyAccessToken, createJob);

jobRouter.get("/all-jobs", verifyAccessToken, getAllJobs);

export default jobRouter;