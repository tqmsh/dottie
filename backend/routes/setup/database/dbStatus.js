import express from 'express';
import db from '../../../db/index.js';

const router = express.Router();

router.get("/api/db-status", async (req, res) => {
  try {
    // Try to query the database
    await db.raw("SELECT 1");
    res.json({ status: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router; 