# Test Page Implementation Plan

## Directory Structure

```
dottie-app/src/components/test_page/
├── page.tsx                     # Main page component (container)
├── wireframe.md                 # Wireframe documentation
├── implementation-plan.md       # This file
├── page-components/             # Component building blocks
│   ├── EndpointTable.tsx        # Reusable table component for endpoints
│   ├── EndpointButton.tsx       # Button component for triggering API calls
│   ├── JsonDisplay.tsx          # Component for displaying JSON with formatting
│   ├── ApiResponse.tsx          # Component for showing API responses
│   └── InputForm.tsx            # Form for POST/PUT requests with parameters
├── endpoints/                   # Organized by endpoint category
│   ├── setup/                   # Setup endpoint components
│   │   ├── SetupEndpoints.tsx   # Container for all setup endpoints
│   │   ├── HealthHello.tsx      # Component for /api/setup/health/hello endpoint
│   │   ├── DatabaseStatus.tsx   # Component for /api/setup/database/status endpoint
│   │   └── DatabaseHello.tsx    # Component for /api/setup/database/hello endpoint
│   ├── auth/                    # Auth endpoint components
│   │   ├── AuthEndpoints.tsx    # Container for all auth endpoints
│   │   ├── Signup.tsx           # Component for /api/auth/signup endpoint
│   │   ├── Login.tsx            # Component for /api/auth/login endpoint
│   │   └── Logout.tsx           # Component for /api/auth/logout endpoint
│   ├── assessment/              # Assessment endpoint components
│   │   ├── AssessmentEndpoints.tsx  # Container for all assessment endpoints
│   │   ├── SendAssessment.tsx   # Component for /api/assessment/send endpoint
│   │   ├── ListAssessments.tsx  # Component for /api/assessment/list endpoint
│   │   ├── GetAssessment.tsx    # Component for /api/assessment/:id endpoint
│   │   ├── UpdateAssessment.tsx # Component for /api/assessment/:id (PUT) endpoint
│   │   └── DeleteAssessment.tsx # Component for /api/assessment/:id (DELETE) endpoint
│   ├── user/                    # User endpoint components
│   │   ├── UserEndpoints.tsx    # Container for all user endpoints
│   │   ├── GetCurrentUser.tsx   # Component for /api/user/me endpoint
│   │   ├── GetUserById.tsx      # Component for /api/user/:id endpoint
│   │   ├── UpdateUser.tsx       # Component for /api/user/:id (PUT) endpoint
│   │   ├── DeleteUser.tsx       # Component for /api/user/:id (DELETE) endpoint
│   │   ├── PasswordReset.tsx    # Component for /api/user/pw/reset endpoint
│   │   └── PasswordUpdate.tsx   # Component for /api/user/pw/update endpoint
│   └── chat/                    # Chat endpoint components
│       ├── ChatEndpoints.tsx    # Container for all chat endpoints
│       ├── SendMessage.tsx      # Component for /api/chat/send endpoint
│       ├── GetHistory.tsx       # Component for /api/chat/history endpoint
│       ├── GetConversation.tsx  # Component for /api/chat/history/:id endpoint
│       └── DeleteConversation.tsx # Component for /api/chat/history/:id (DELETE) endpoint
└── __tests__/                   # Test files (existing structure)
```

## Component Architecture

### Main Components

1. **page.tsx**
   - Main container component
   - Imports and renders category containers
   - Handles global state (if needed)
   - Provides environment information

2. **EndpointTable.tsx**
   - Reusable table component
   - Takes a title and array of endpoint items
   - Renders table headers and rows

3. **EndpointButton.tsx**
   - Button component for triggering API calls
   - Handles loading state and success/error status
   - Changes color based on response status

### State Management

- Each endpoint component will manage its own state
- Local state for:
  - API response data
  - Loading state
  - Success/error status
  - Form inputs (for POST/PUT)

### API Call Structure

```typescript
// Example structure for a typical endpoint component
interface EndpointProps {
  // Props if needed
}

export default function EndpointComponent({ /* props */ }: EndpointProps) {
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inputParams, setInputParams] = useState({ /* default values */ });

  const handleAPICall = async () => {
    setIsLoading(true);
    setStatus('idle');
    
    try {
      // Make API call
      const result = await apiService.get('/api/endpoint');
      
      // Update state with response
      setResponse(result.data);
      setStatus('success');
    } catch (error) {
      console.error('API call error:', error);
      setResponse(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr>
      <td>
        <EndpointButton 
          label="GET /api/endpoint"
          onClick={handleAPICall}
          status={status}
          isLoading={isLoading}
        />
      </td>
      <td>
        <JsonDisplay data={{ /* expected format */ }} />
      </td>
      <td>
        <ApiResponse data={response} status={status} />
      </td>
    </tr>
  );
}
```

## Implementation Strategy

### Phase 1: Core Components
1. Create reusable components (EndpointTable, EndpointButton, JsonDisplay, ApiResponse)
2. Implement the basic page structure
3. Create category containers (SetupEndpoints, AuthEndpoints, etc.)

### Phase 2: Implement Simple Endpoints
1. Start with GET endpoints that don't require authentication or parameters
2. Implement the setup endpoints first as they are the simplest

### Phase 3: Implement Complex Endpoints
1. Add endpoints that require authentication
2. Implement endpoints with path parameters
3. Add POST/PUT endpoints with form inputs

### Phase 4: Styling and Responsiveness
1. Ensure consistent styling across all components
2. Implement responsive design for mobile devices
3. Add visual improvements (animations, transitions)

### Phase 5: Testing
1. Create unit tests for components
2. Add integration tests for API interactions
3. Test on various screen sizes

## Notes on Implementation

- Use TypeScript interfaces for all component props and API responses
- Implement error handling for all API calls
- Add accessibility features (ARIA attributes, keyboard navigation)
- Consider caching responses for better performance
- Add logging for debugging purposes 