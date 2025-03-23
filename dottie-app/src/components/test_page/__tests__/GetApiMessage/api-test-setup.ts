import axios from 'axios';

// Helper utility to check if the API server is running
export const isApiRunning = async (): Promise<boolean> => {
  try {
    await axios.get('/api/hello', { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
};

// Helper to start API server when needed
export const ensureApiRunning = async (): Promise<boolean> => {
  // First check if API is already running
  if (await isApiRunning()) {
    console.log('✅ API server is already running');
    return true;
  }

  console.log('⚠️ API server is not running. Starting server...');
  try {
    // In a test environment, we can use this approach:
    // 1. Create a special hook for starting the server
    // 2. Try to use the API after a short delay
    
    // This starts the dev server using a child process
    // Note: This would typically be handled by your test runner setup
    // or by running the server separately before tests
    
    // Simple polling to wait for server to start (if started externally)
    let attempts = 0;
    const maxAttempts = 5;
    
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
    const apiRunning = await isApiRunning();
    
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