import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { listAssessments } from "./controller.js";

const router = express.Router();

/**
 * Get list of all assessments for a specific user
 * GET /api/assessment/:userId
 */
router.get("/:userId", authenticateToken, listAssessments);

export default router; 