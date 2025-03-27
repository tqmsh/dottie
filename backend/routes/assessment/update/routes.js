import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { updateAssessment } from "./controller.js";

const router = express.Router();

/**
 * Update a specific assessment by user ID / assessment ID
 * PUT /api/assessment/:userId/:assessmentId
 */
router.put("/:userId/:assessmentId", authenticateToken, updateAssessment);

export default router; 