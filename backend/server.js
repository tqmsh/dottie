import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World from Dottie API!' });
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