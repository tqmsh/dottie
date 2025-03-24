import express from "express";
import { submitAnswer } from "../../controllers/assessmentController.js";

const router = express.Router();

router.post("/answer", submitAnswer);

export default router; 