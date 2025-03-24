import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./db/index.js";

// Import route modules
import assessmentRoutes from "./routes/assessmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth/index.js";
import serverlessTestRoutes from "./routes/serverlessTestRoutes.js";

// Import refactored endpoints
import helloEndpoint from "./setup/hello.js";
import serverlessTestEndpoint from "./setup/serverlessTest.js";
import sqlHelloEndpoint from "./setup/database/sqlHello.js";
import dbStatusEndpoint from "./setup/database/dbStatus.js";
import errorHandlers from "./setup/errorHandlers.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount refactored endpoint routers
app.use(helloEndpoint);
app.use(serverlessTestEndpoint);
app.use(sqlHelloEndpoint);
app.use(dbStatusEndpoint);

// Mount route modules
app.use("/api/assessment", assessmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/serverless-test", serverlessTestRoutes);

// Mount error handlers (this should be last)
app.use(errorHandlers);

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
