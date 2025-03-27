import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { getAssessmentDetail } from "./controller.js";

const router = express.Router();

/**
 * Get detailed view of a specific assessment by user ID / assessment ID
 * GET /api/assessment/:userId/:assessmentId
 */
router.get("/:userId/:assessmentId", authenticateToken, getAssessmentDetail);

export default router; 