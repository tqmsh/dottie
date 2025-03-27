import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./db/index.js";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Import route modules
import assessmentRoutes from "./routes/assessment/index.js";
import userRoutes from "./routes/user/index.js";
import authRoutes from "./routes/auth/index.js";
import setupRoutes from "./routes/setup/index.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://dottie-app.com' 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Mount route modules
app.use("/api/assessment", assessmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/setup", setupRoutes);

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
