import { spawn } from 'child_process';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to check if a port is already in use
function isPortInUse(port) {
  try {
    // This command will fail with non-zero exit code if port is not in use
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}` 
      : `lsof -i:${port}`;
    
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Define constants
const API_PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${API_PORT}`;

console.log(`Checking if API server is already running on port ${API_PORT}...`);

if (isPortInUse(API_PORT)) {
  console.log(`✅ API server is already running on port ${API_PORT}.`);
  runTests();
} else {
  console.log(`Starting API server on port ${API_PORT}...`);
  
  // Start the backend server
  const serverProcess = spawn('node', [path.join(__dirname, '..', 'backend', 'server.js')], {
    stdio: 'inherit',
    env: { ...process.env, PORT: API_PORT }
  });
  
  // Set a timeout to allow server to start
  setTimeout(() => {
    console.log(`Waiting for API server to start...`);
    
    // Check if port is now in use
    if (isPortInUse(API_PORT)) {
      console.log(`✅ API server started successfully on port ${API_PORT}.`);
      runTests();
    } else {
      console.error(`❌ Failed to start API server on port ${API_PORT}.`);
      process.exit(1);
    }
  }, 3000);
  
  // Clean up the server process when tests are done
  process.on('exit', () => {
    console.log('Shutting down API server...');
    serverProcess.kill();
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down API server...');
    serverProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down API server...');
    serverProcess.kill();
    process.exit(0);
  });
}

function runTests() {
  console.log('Running tests...');
  
  // Run the tests using vitest
  const testProcess = spawn('npm', ['test', '--', 'GetApiMessage'], {
    stdio: 'inherit',
    shell: true
  });
  
  testProcess.on('close', (code) => {
    console.log(`Tests finished with exit code ${code}`);
    process.exit(code);
  });
} 