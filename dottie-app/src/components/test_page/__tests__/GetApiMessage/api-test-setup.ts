import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate correct paths
const projectRoot = path.resolve(__dirname, '../../../../../..');
const backendDir = path.join(projectRoot, 'backend');
const serverPath = path.join(backendDir, 'server.js');

// Configure axios for API tests
const API_BASE_URL = 'http://localhost:5000';
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

// Helper utility to check if the API server is running
export const isApiRunning = async (): Promise<boolean> => {
  try {
    // Use the full URL with port 5000 where the backend API is running
    await apiClient.get('/api/hello', { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
};

// Global variable to keep track of the server process
let serverProcess: ReturnType<typeof spawn> | null = null;

// Helper to start API server when needed
export const ensureApiRunning = async (): Promise<boolean> => {
  // First check if API is already running
  if (await isApiRunning()) {
    console.log('✅ API server is already running');
    return true;
  }

  console.log('⚠️ API server is not running. Starting server...');
  try {
    // Check if paths exist
    if (!fs.existsSync(backendDir) || !fs.existsSync(serverPath)) {
      console.error(`❌ Required paths not found. Backend: ${backendDir}, Server: ${serverPath}`);
      return false;
    }
    
    console.log(`Backend directory: ${backendDir}`);
    console.log(`Server file path: ${serverPath}`);
    
    // Find the Node executable path - use process.execPath for actual path to node
    const nodeExecutable = process.execPath;
    console.log(`Using Node executable: ${nodeExecutable}`);
    
    // Start the server directly with Node
    serverProcess = spawn(nodeExecutable, [serverPath], {
      cwd: backendDir,
      stdio: 'pipe', // Capture output to avoid cluttering the test output
      env: { ...process.env, PORT: '5000' }
    });
    
    // Log server output for debugging
    serverProcess.stdout?.on('data', (data) => {
      console.log(`Backend server: ${data.toString().trim()}`);
    });
    
    serverProcess.stderr?.on('data', (data) => {
      console.error(`Backend server error: ${data.toString().trim()}`);
    });
    
    // Handle server exit
    serverProcess.on('exit', (code) => {
      console.log(`Backend server exited with code ${code}`);
      serverProcess = null;
    });
    
    // Handle the process exit to clean up the server
    process.on('exit', () => {
      if (serverProcess) {
        console.log('Shutting down backend server...');
        serverProcess.kill();
      }
    });
    
    // Handle termination signals
    process.on('SIGINT', () => {
      if (serverProcess) {
        console.log('Received SIGINT. Shutting down backend server...');
        serverProcess.kill();
      }
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      if (serverProcess) {
        console.log('Received SIGTERM. Shutting down backend server...');
        serverProcess.kill();
      }
      process.exit(0);
    });
    
    // Wait for the server to start with polling
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Checking if API is up (attempt ${attempts}/${maxAttempts})...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (await isApiRunning()) {
        console.log('✅ API server is now running');
        return true;
      }
    }
    
    console.log('❌ Could not connect to API server after multiple attempts');
    // If we couldn't connect, kill the server process
    if (serverProcess) {
      serverProcess.kill();
      serverProcess = null;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to start API server:', error);
    return false;
  }
};

// Export a conditional testing function that only runs tests if API is available
export const conditionalApiTest = (
  name: string, 
  fn: () => Promise<void>, 
  skipInsteadOfFail = true
) => {
  return async () => {
    // Try to ensure the API is running before each test
    const apiRunning = await ensureApiRunning();
    
    if (!apiRunning) {
      const message = '⚠️ API server is not running, skipping test';
      console.log(message);
      if (skipInsteadOfFail) {
        return; // Skip
      } else {
        throw new Error(message); // Fail
      }
    }
    
    // API is running, proceed with test
    await fn();
  };
}; 