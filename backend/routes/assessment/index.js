import express from "express";
import startRoutes from "./start.js";
import answerRoutes from "./answer.js";
import resultsRoutes from "./results.js";
import sendRoutes from "./send.js";
import listRoutes from "./list.js";
import getByIdRoutes from "./getById.js";

const router = express.Router();

// Mount all assessment-related routes
router.use(startRoutes);
router.use(answerRoutes);
router.use(resultsRoutes);
router.use(sendRoutes);
router.use(listRoutes);
router.use(getByIdRoutes);

export default router; 