import supertest from 'supertest';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { resolveFromRoot } from './paths.js';
import { getApiUrl, getEnvironment, URLS } from './urls.js';

/**
 * Dynamically import the app from server.js
 * @param {boolean} isProd - Whether to setup production environment
 */
const getApp = async (isProd = false) => {
  // Set environment variables if needed
  if (isProd) {
    process.env.NODE_ENV = 'production';
    process.env.TEST_ENV = 'PROD';
  }
  
  // Import the app
  const appModule = await import(resolveFromRoot('server.js'));
  return appModule.default;
};

/**
 * Setup a test client for either local or production testing
 * @param {Object} options - Configuration options
 * @param {number} options.port - Port for local server (default: 5001)
 * @param {boolean} options.production - Force production mode (default: false)
 */
export const setupTestClient = async (options = {}) => {
  const { port = 5001, production = false } = options;
  
  // Determine environment
  const isProd = production || getEnvironment() === 'PROD';
  const apiUrl = getApiUrl(isProd ? 'PROD' : 'DEV');
  
  if (isProd) {
    // Production: use remote API via fetch
    console.log(`Setting up remote test client for ${apiUrl}`);
    
    const request = {
      get: (path) => makeRemoteRequest('GET', apiUrl + path),
      post: (path) => makeRemoteRequest('POST', apiUrl + path),
      put: (path) => makeRemoteRequest('PUT', apiUrl + path),
      delete: (path) => makeRemoteRequest('DELETE', apiUrl + path),
    };
    
    return { request, apiUrl, isRemote: true };
  } else {
    // Local: start a test server
    console.log(`Setting up local test server on port ${port}`);
    
    const app = await getApp(false);
    const request = supertest(app);
    const server = createServer(app);
    
    await new Promise(resolve => {
      server.listen(port, () => {
        console.log(`Test server started on port ${port}`);
        resolve(true);
      });
    });
    
    return { app, request, server, apiUrl, isRemote: false };
  }
};

/**
 * Helper function to make remote requests to the production API
 */
const makeRemoteRequest = (method, url) => {
  const requestObj = {
    method,
    headers: {}
  };
  
  // Return a chainable object similar to supertest
  const requestChain = {
    set: (headerName, headerValue) => {
      requestObj.headers[headerName] = headerValue;
      return requestChain;
    },
    send: (body) => {
      if (body) {
        requestObj.body = JSON.stringify(body);
        if (!requestObj.headers['Content-Type']) {
          requestObj.headers['Content-Type'] = 'application/json';
        }
      }
      return executeRequest();
    },
    // Support for direct execution without body
    then: (callback) => executeRequest().then(callback)
  };
  
  // Execute the fetch request
  const executeRequest = async () => {
    try {
      const response = await fetch(url, requestObj);
      const responseData = await (response.status !== 204 ? response.json().catch(() => ({})) : {});
      
      return {
        status: response.status,
        body: responseData,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      console.error('Error executing remote request:', error);
      return {
        status: 500,
        body: { error: error.message },
        headers: {}
      };
    }
  };
  
  return method === 'GET' ? requestChain : requestChain;
};

/**
 * Create a JWT token for testing
 * @param {string} userId - User ID to include in the token
 * @param {boolean} isProd - Whether this is for production environment
 */
export const createTestToken = (userId, isProd = false) => {
  const email = `test_${isProd ? 'prod_' : ''}${Date.now()}@example.com`;
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(
    { id: userId, email },
    secret,
    { expiresIn: '1h' }
  );
};

/**
 * Close a test server gracefully
 */
export const closeTestServer = async (server) => {
  if (!server) return;
  
  return new Promise(resolve => {
    server.close(() => {
      console.log('Test server closed');
      resolve(true);
    });
  });
}; 