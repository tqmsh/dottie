# Database Connection Tests

This directory contains tests for the database connection functionality in the test page.

## Expected Behavior

When the user clicks the "Test SQLite Connection" button:

1. The application makes two API calls:
   - `/api/sql-hello` - Tests the database connection by running a simple query
   - `/api/db-status` - Verifies the database is connected

2. Upon success, the following messages should be displayed in this order:
   - "SQL connection successful" - Generic success message
   - "Database status: connected" - The status from the db-status endpoint
   - "SQLite message retrieved: "Hello World from Azure SQL!"" - The message returned from the SQL query

3. The button should turn green to indicate success.

## Test Files

### Mock Tests

- `db-connection.mock.dev.spec.ts` - Tests with mocked API responses
  - Intercepts API calls and returns mock responses
  - Verifies UI elements display correct messages
  - Tests both success and error cases

### Real Tests

- `db-connection.real.dev.spec.ts` - Tests with real backend
  - Requires the backend server to be running
  - Makes actual database connections
  - Verifies the entire flow from frontend to backend to database

## Integration with Backend

The backend endpoints handle the database connections:

```javascript
// Azure SQL test endpoint
app.get("/api/sql-hello", async (req, res) => {
  try {
    // Try to query the database
    const result = await db.raw("SELECT 'Hello World from Azure SQL!' AS message");
    // Different DB providers return results in different formats
    const message = db.client.config.client === 'mssql' 
      ? result[0].message 
      : result[0]?.message || 'Hello from Database!';
    
    res.json({ 
      message,
      dbType: db.client.config.client,
      isConnected: true
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      dbType: db.client.config.client,
      isConnected: false
    });
  }
});

// Database status endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    // Try to query the database
    await db.raw("SELECT 1");
    res.json({ status: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
```

## Screenshots

Tests capture screenshots at various stages:
- Initial state
- After clicking the test button
- Final result showing success/error messages 