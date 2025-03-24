import express from "express";
import { startAssessment } from "../../controllers/assessmentController.js";

const router = express.Router();

router.post("/start", startAssessment);

export default router; 