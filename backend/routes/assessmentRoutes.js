import express from "express";
import assessmentRoutes from "./assessment/index.js";

const router = express.Router();

// Remove logging middleware
// router.use((req, res, next) => {
//   console.log(`Assessment route: ${req.method} ${req.path}`);
//   next();
// });

router.use(assessmentRoutes);

export default router;
