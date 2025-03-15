import express from "express";
import {
  startAssessment,
  submitAnswer,
  getResults,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`Assessment route: ${req.method} ${req.path}`);
  next();
});

// Routes for assessment
router.post("/start", startAssessment);
router.post("/answer", submitAnswer);
router.get("/results/:assessmentId", getResults);

export default router;
