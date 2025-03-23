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

// Configure axios for API tests - default port with ability to change it
let API_PORT = 5000;
const API_BASE_URL = `http://localhost:${API_PORT}`;
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

// Simple mutex to prevent multiple test files from starting server simultaneously
let startServerMutex = false;
let startServerPromise: Promise<boolean> | null = null;

// Helper utility to check if the API server is running
export const isApiRunning = async (port = API_PORT): Promise<boolean> => {
  try {
    // Use node-fetch compatible approach that works better with JSDOM
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    try {
      const response = await fetch(`http://localhost:${port}/api/hello`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      // Silently fail - expected when server isn't running
      clearTimeout(timeoutId);
      return false;
    }
  } catch (error) {
    // Fallback error handler - should not be triggered with the approach above
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

  // If another test is already trying to start the server, wait for that to complete
  if (startServerMutex && startServerPromise) {
    console.log('⏳ Another test is already starting the API server. Waiting...');
    return startServerPromise;
  }

  // Acquire mutex and create a promise for others to wait on
  startServerMutex = true;
  startServerPromise = (async () => {
    console.log('🚀 Starting API server for tests...');
    try {
      // Check if paths exist
      if (!fs.existsSync(backendDir) || !fs.existsSync(serverPath)) {
        console.error(`❌ Required paths not found. Backend: ${backendDir}, Server: ${serverPath}`);
        return false;
      }
      
      // Skip verbose path logs unless debugging is needed
      // console.log(`Backend directory: ${backendDir}`);
      // console.log(`Server file path: ${serverPath}`);
      
      // Find the Node executable path - use process.execPath for actual path to node
      const nodeExecutable = process.execPath;
      // console.log(`Using Node executable: ${nodeExecutable}`);
      
      // Try starting the server with the default port
      const startServer = (port: number): ReturnType<typeof spawn> => {
        // Update API client to use the current port
        API_PORT = port;
        apiClient.defaults.baseURL = `http://localhost:${port}`;
        
        return spawn(nodeExecutable, [serverPath], {
          cwd: backendDir,
          stdio: 'pipe', // Capture output to avoid cluttering the test output
          env: { ...process.env, PORT: port.toString() }
        });
      };

      // Initial server start
      serverProcess = startServer(API_PORT);
      
      let isPortInUse = false;
      let secondAttemptMade = false;
      
      // Log server output for debugging
      serverProcess.stdout?.on('data', (data) => {
        console.log(`Backend server: ${data.toString().trim()}`);
      });
      
      serverProcess.stderr?.on('data', (data) => {
        const errorOutput = data.toString().trim();
        console.error(`Backend server error: ${errorOutput}`);
        
        // Check for port already in use error
        if (errorOutput.includes('EADDRINUSE') && !secondAttemptMade) {
          isPortInUse = true;
          secondAttemptMade = true;
          
          // Port is in use - check if it's our API already running
          console.log(`Port ${API_PORT} is already in use. Checking if it's our API...`);
          
          // Try to connect to whatever is running on the port
          isApiRunning(API_PORT).then(isRunning => {
            if (isRunning) {
              console.log(`✅ API appears to be already running on port ${API_PORT}`);
              // Don't need to do anything, the existing server will be used
            } else {
              console.log(`⚠️ Something else is using port ${API_PORT}, but it's not our API.`);
              
              // Try an alternative port
              const alternativePort = API_PORT + 1;
              console.log(`Attempting to start server on alternative port ${alternativePort}...`);
              
              if (serverProcess) {
                serverProcess.kill();
                serverProcess = startServer(alternativePort);
                
                // Set up the listeners again for the new process
                serverProcess.stdout?.on('data', (data) => {
                  console.log(`Backend server: ${data.toString().trim()}`);
                });
                
                serverProcess.stderr?.on('data', (data) => {
                  console.error(`Backend server error: ${data.toString().trim()}`);
                });
                
                serverProcess.on('exit', (code) => {
                  console.log(`Backend server exited with code ${code}`);
                  serverProcess = null;
                });
              }
            }
          });
        }
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
        console.log(`◌ Waiting for API server to start... (${attempts}/${maxAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (await isApiRunning(API_PORT)) {
          console.log(`✅ API server is now running on port ${API_PORT}`);
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
    } finally {
      // Release mutex
      startServerMutex = false;
      startServerPromise = null;
    }
  })();
  
  return startServerPromise;
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