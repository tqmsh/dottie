import express from 'express';

const router = express.Router();

router.get("/api/serverless-test", (req, res) => {
  const now = new Date();
  res.json({ 
    message: "Serverless function is working!",
    timestamp: now.toISOString(),
    environment: {
      node_env: process.env.NODE_ENV || 'not set',
      is_vercel: process.env.VERCEL === '1' ? 'Yes' : 'No',
      region: process.env.VERCEL_REGION || 'unknown'
    }
  });
});

export default router; 