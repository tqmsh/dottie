# Dottie API Endpoints

## Testing Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hello` | GET | Test endpoint to verify API is working |
| `/api/db-status` | GET | Check database connection status |

## Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user account |
| `/api/auth/login` | POST | Authenticate user and get access token |
| `/api/auth/logout` | POST | Logout user and invalidate token |

## Assessment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assessment/send` | POST | Send assessment results from frontend context, generates a new assessmentId |
| `/api/assessment/list` | GET | Get list of all assessments for the authenticated user |
| `/api/assessment/:id` | GET | Get detailed view of a specific assessment by ID |
| `/api/assessment/:id` | PUT | Update a specific assessment by ID |
| `/api/assessment/:id` | DELETE | Delete a specific assessment by ID |


## User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/` | GET | Get list of all users |
| `/api/user/:id` | GET | Get user by ID (to be phased out in next iteration for /api/user/me) |
| `/api/user/me` | GET | Get current user |
| `/api/user/:id` | PUT | Update a user |
| `/api/user/:id` | DELETE | Delete a user |
| `/api/user/pw/reset` | POST | Reset forgotten password |
| `/api/user/pw/update` | POST | Update current user's password |

## Request Examples

### Authentication

```javascript
// Signup
fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "user123",
    email: "user@example.com",
    password: "securePassword123"
  })
});

// Login
fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123"
  })
});
```

### Assessment

```javascript
// Send assessment
fetch("/api/assessment/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    userId: "user-123",
    assessmentData: {
      age: "18_24",
      cycleLength: "26_30",
      periodDuration: "4_5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings", "Irritability"]
      }
    }
  })
});

// Get assessment list
fetch("/api/assessment/list", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});

// Get specific assessment
fetch("/api/assessment/assessment-123", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});
```

### User

```javascript
// Update password
fetch("/api/user/pw/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    currentPassword: "oldPassword123",
    newPassword: "newSecurePassword456"
  })
});
``` 