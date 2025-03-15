import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import assessmentRoutes from "./routes/assessmentRoutes.js";

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

// Add assessment routes
app.use("/api/assessment", assessmentRoutes);

// Add this for debugging - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", req.body);
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
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}
