import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import serverlessTestRoutes from "./routes/serverlessTestRoutes.js";
import db from "./db/index.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
// Make sure this line is here and comes BEFORE your routes
app.use(express.json());

// Routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello World from Dottie API!" });
});

// Simple serverless test endpoint
app.get("/api/serverless-test", (req, res) => {
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

// Azure SQL test endpoint
app.get("/api/sql-hello", async (req, res) => {
  try {
    // Determine the database type
    const dbType = db.client.config.client;
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Create dynamic message based on the database type
    const dbTypeName = dbType === 'mssql' ? 'Azure SQL' : 'SQLite';
    
    // Query with the dynamic message
    const result = await db.raw(`SELECT 'Hello World from ${dbTypeName}!' AS message`);
    
    // Different DB providers return results in different formats
    const message = dbType === 'mssql' 
      ? result[0].message 
      : result[0]?.message || `Hello World from ${dbTypeName}!`;
    
    res.json({ 
      message,
      dbType,
      isConnected: true
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      dbType: db.client.config.client,
      isConnected: false
    });
  }
});

// Database status endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    // Try to query the database
    await db.raw("SELECT 1");
    res.json({ status: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Add routes with correct mappings
app.use("/api/assessment", assessmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/serverless-test", serverlessTestRoutes);

// Add this after your routes setup
app.use((req, res, next) => {
  // Only log this in test mode if needed for debugging
  // console.log(`Testing route validation: ${req.method} ${req.path} - 🔍 route not registered \n ✅ ...this is expected in 404 tests)`);
  res.status(404).json({ error: "Not found" });
});

// Add this to catch errors
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

// For local development
const PORT = process.env.PORT || 5000;

// Start server only if this file is run directly (not in serverless mode)
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  // Initialize database connection when running as a standalone server
  try {
    await db.raw('SELECT 1');
    console.log("Database connection successful");
    
    // Start server after DB connection is verified
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

// Export for serverless environment
export default app;
