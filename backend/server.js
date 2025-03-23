import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import initializeDatabase from "./db/init.js";
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

// Azure SQL test endpoint
app.get("/api/sql-hello", async (req, res) => {
  try {
    // Try to query the database
    const result = await db.raw("SELECT 'Hello World from Azure SQL!' AS message");
    // Different DB providers return results in different formats
    const message = db.client.config.client === 'mssql' 
      ? result[0].message 
      : result[0]?.message || 'Hello from Database!';
    
    res.json({ 
      message,
      dbType: db.client.config.client,
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

// Add this for debugging - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
});

// Add this after your routes setup
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - not found`);
  res.status(404).json({ error: "Not found" });
});

// Add this to catch errors
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

// Define port
const PORT = process.env.PORT || 5000;

// Export app for testing
export default app;

// Start server only if this file is run directly
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  // Initialize database before starting server
  try {
    // Only create tables, don't close connection
    await db.raw('SELECT 1');
    console.log("Database connection successful");
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}
