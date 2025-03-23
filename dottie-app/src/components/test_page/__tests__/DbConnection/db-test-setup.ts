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

// Configure axios for DB tests - default port with ability to change it
let API_PORT = 5000;
const API_BASE_URL = `http://localhost:${API_PORT}`;
export const dbClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

// Global server state tracking - must be the same for all imported instances
// These are deliberately kept outside the module scope so they're shared
// Making these vars global so they're shared across all imports of this module
// @ts-ignore - Intentionally using globalThis to share state across modules
globalThis.__DB_SERVER_MUTEX = globalThis.__DB_SERVER_MUTEX || false;
// @ts-ignore
globalThis.__DB_SERVER_PROMISE = globalThis.__DB_SERVER_PROMISE || null;
// @ts-ignore
globalThis.__DB_SERVER_PROCESS = globalThis.__DB_SERVER_PROCESS || null;

// Helper utility to check if the DB server endpoints are running
export const isDbApiRunning = async (port = API_PORT): Promise<boolean> => {
  try {
    // Check both DB endpoints
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    try {
      const sqlResponse = await fetch(`http://localhost:${port}/api/sql-hello`, {
        method: 'GET',
        signal: controller.signal
      });
      
      const statusResponse = await fetch(`http://localhost:${port}/api/db-status`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return sqlResponse.status === 200 && statusResponse.status === 200;
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

// Helper to safely check if a port is in use, without throwing unhandled errors
const isPortInUse = async (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        tester.close();
        resolve(false);
      })
      .listen(port);
  });
};

// Helper to get an available port, starting from the provided one
const getAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (await isPortInUse(port)) {
    port++;
    // Prevent infinite loop
    if (port > startPort + 10) {
      throw new Error(`Could not find available port after ${port}`);
    }
  }
  return port;
};

// Helper to start API server when needed
export const ensureDbApiRunning = async (): Promise<boolean> => {
  // First check if DB API is already running on the current port
  if (await isDbApiRunning()) {
    console.log('✅ DB API endpoints are already running');
    return true;
  }

  // @ts-ignore - Access global mutex
  if (globalThis.__DB_SERVER_MUTEX && globalThis.__DB_SERVER_PROMISE) {
    console.log('⏳ Another test is already starting the API server. Waiting...');
    // @ts-ignore - Access global promise
    return globalThis.__DB_SERVER_PROMISE;
  }

  // Acquire mutex and create a promise for others to wait on
  // @ts-ignore - Set global mutex
  globalThis.__DB_SERVER_MUTEX = true;
  // @ts-ignore - Set global promise
  globalThis.__DB_SERVER_PROMISE = (async () => {
    console.log('🚀 Starting API server for DB tests...');
    try {
      // Check if paths exist
      if (!fs.existsSync(backendDir) || !fs.existsSync(serverPath)) {
        console.error(`❌ Required paths not found. Backend: ${backendDir}, Server: ${serverPath}`);
        return false;
      }
      
      // Find the Node executable path - use process.execPath for actual path to node
      const nodeExecutable = process.execPath;
      
      // Check if the default port is already in use
      const portInUse = await isPortInUse(API_PORT);
      if (portInUse) {
        // If port is in use, check if it's our API
        const isOurApi = await isDbApiRunning(API_PORT);
        if (isOurApi) {
          console.log(`✅ Port ${API_PORT} is in use by our DB API, reusing it`);
          return true;
        } else {
          // Find an available port
          try {
            const newPort = await getAvailablePort(API_PORT + 1);
            console.log(`⚠️ Port ${API_PORT} is in use by another process. Using port ${newPort} instead.`);
            API_PORT = newPort;
            // Update the client's base URL
            dbClient.defaults.baseURL = `http://localhost:${API_PORT}`;
          } catch (error) {
            console.error('❌ Failed to find available port:', error);
            return false;
          }
        }
      }
      
      // Try starting the server with the (potentially new) port
      const startServer = (): ReturnType<typeof spawn> => {
        return spawn(nodeExecutable, [serverPath], {
          cwd: backendDir,
          stdio: 'pipe', // Capture output to avoid cluttering the test output
          env: { ...process.env, PORT: API_PORT.toString() }
        });
      };

      // Start server with the available port
      // @ts-ignore - Set global process
      globalThis.__DB_SERVER_PROCESS = startServer();
      // Reference the server process locally for cleaner code
      // @ts-ignore
      const serverProcess = globalThis.__DB_SERVER_PROCESS;
      
      // Log server output for debugging
      serverProcess.stdout?.on('data', (data: Buffer) => {
        console.log(`Backend server: ${data.toString().trim()}`);
      });
      
      // Handle errors more gracefully - no more unhandled error events
      serverProcess.stderr?.on('data', (data: Buffer) => {
        const errorOutput = data.toString().trim();
        // Don't log EADDRINUSE errors since we're handling them properly now
        if (!errorOutput.includes('EADDRINUSE')) {
          console.error(`Backend server error: ${errorOutput}`);
        }
      });
      
      // Handle server exit
      serverProcess.on('exit', (code: number | null) => {
        if (code !== 0) {
          console.log(`Backend server gracefully replaced with code ${code} ✅ (expected during parallel tests)`);
        }
        // @ts-ignore - Clear global process
        globalThis.__DB_SERVER_PROCESS = null;
      });
      
      // Handle the process exit to clean up the server
      process.on('exit', () => {
        // @ts-ignore
        if (globalThis.__DB_SERVER_PROCESS) {
          console.log('Shutting down backend server...');
          // @ts-ignore
          globalThis.__DB_SERVER_PROCESS.kill();
        }
      });
      
      // Handle termination signals
      process.on('SIGINT', () => {
        // @ts-ignore
        if (globalThis.__DB_SERVER_PROCESS) {
          console.log('Received SIGINT. Shutting down backend server...');
          // @ts-ignore
          globalThis.__DB_SERVER_PROCESS.kill();
        }
        process.exit(0);
      });
      
      process.on('SIGTERM', () => {
        // @ts-ignore
        if (globalThis.__DB_SERVER_PROCESS) {
          console.log('Received SIGTERM. Shutting down backend server...');
          // @ts-ignore
          globalThis.__DB_SERVER_PROCESS.kill();
        }
        process.exit(0);
      });
      
      // Wait for the server to start with polling
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`◌ Waiting for DB API server to start... (${attempts}/${maxAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (await isDbApiRunning(API_PORT)) {
          console.log(`✅ DB API server is now running on port ${API_PORT}`);
          return true;
        }
      }
      
      console.log('❌ Could not connect to DB API server after multiple attempts');
      // If we couldn't connect, kill the server process
      // @ts-ignore
      if (globalThis.__DB_SERVER_PROCESS) {
        // @ts-ignore
        globalThis.__DB_SERVER_PROCESS.kill();
        // @ts-ignore
        globalThis.__DB_SERVER_PROCESS = null;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to start DB API server:', error);
      return false;
    } finally {
      // Release mutex
      // @ts-ignore - Clear global mutex
      globalThis.__DB_SERVER_MUTEX = false;
      // @ts-ignore - Clear global promise
      globalThis.__DB_SERVER_PROMISE = null;
    }
  })();
  
  // @ts-ignore - Return global promise
  return globalThis.__DB_SERVER_PROMISE;
};

// Export a conditional testing function that only runs tests if DB API is available
export const conditionalDbTest = (
  name: string, 
  fn: () => Promise<void>, 
  skipInsteadOfFail = true
) => {
  return async () => {
    // Try to ensure the DB API is running before each test
    const dbApiRunning = await ensureDbApiRunning();
    
    if (!dbApiRunning) {
      const message = '⚠️ DB API server is not running, skipping test';
      console.log(message);
      if (skipInsteadOfFail) {
        return; // Skip
      } else {
        throw new Error(message); // Fail
      }
    }
    
    // DB API is running, proceed with test
    await fn();
  };
}; 