import dotenv from 'dotenv';
import fs from 'fs';

// Explicitly load environment variables
dotenv.config();

async function testEnvVars() {
  const output = [];
  const logOutput = (msg) => {
    console.log(msg);
    output.push(typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
  };

  logOutput('Testing environment variables...');
  logOutput(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Check Azure SQL config variables
  logOutput('Azure SQL Configuration:');
  logOutput(`AZURE_SQL_SERVER: ${process.env.AZURE_SQL_SERVER || 'Not set'}`);
  logOutput(`AZURE_SQL_DATABASE: ${process.env.AZURE_SQL_DATABASE || 'Not set'}`);
  logOutput(`AZURE_SQL_USER: ${process.env.AZURE_SQL_USER || 'Not set'}`);
  logOutput(`AZURE_SQL_PASSWORD: ${process.env.AZURE_SQL_PASSWORD ? 'Set (value hidden)' : 'Not set'}`);
  
  // Evaluate if Azure SQL would be used
  const isProduction = process.env.NODE_ENV === 'production';
  const useAzure = isProduction && process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_DATABASE;
  
  logOutput(`isProduction: ${isProduction}`);
  logOutput(`useAzure: ${useAzure}`);
  logOutput(`Conclusion: The application would use ${useAzure ? 'Azure SQL' : 'SQLite'}`);
  
  // Write results to file
  fs.writeFileSync('env-vars-output.txt', output.join('\n'));
  console.log('Results written to env-vars-output.txt');
}

testEnvVars(); 