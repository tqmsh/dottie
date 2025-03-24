import express from "express";
import { getResults } from "../../controllers/assessmentController.js";

const router = express.Router();

router.get("/results/:assessmentId", getResults);

export default router; 