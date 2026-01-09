# ASP.NET Core Authentication Integration

This document describes the frontend authentication integration with the ASP.NET Core backend.

## Overview

The application now uses JWT-based authentication with an ASP.NET Core backend. All authentication flows (login, register, admin protection) are handled through API calls.

## New Files Created

### API Infrastructure (`src/data/`)

1. **`tokenStorage.js`** - Token management helpers
   - `getToken()` - Retrieve JWT from localStorage
   - `setToken(token)` - Store JWT in localStorage
   - `clearToken()` - Remove JWT from localStorage

2. **`apiClient.js`** - Axios client with interceptors
   - Auto-attaches Bearer token to all requests
   - Handles 401 responses (clears token, redirects to login)
   - Configurable base URL from environment variables

3. **`authApi.js`** - Authentication API functions
   - `register(dto)` - POST /api/auth/register
   - `login(dto)` - POST /api/auth/login
   - `checkAuthorize()` - GET /api/auth/check-authorize
   - `getUserSummary(token)` - POST /api/auth/get-user-summary

### Authentication State (`src/hooks/`)

1. **`AuthContext.jsx`** - React Context Provider
   - Manages: token, isAuthenticated, userSummary, loading, error
   - Actions: login, register, logout, loadUserSummary, checkAuthorize
   - Auto-loads user summary on app initialization if token exists

2. **`useAuth.js`** - Custom hook for accessing auth context
   - Provides easy access to auth state and methods
   - Usage: `const { isAuthenticated, login, logout, userSummary } = useAuth();`

### Route Protection (`src/admin/admin-components/`)

1. **`AdminProtectedRoute.jsx`** - Protected route wrapper
   - Checks authentication before rendering admin routes
   - Redirects to `/auth/login` if not authenticated
   - Shows loading state while checking auth

## Updated Files

### Components

1. **`src/components/login-form/login-form.jsx`**
   - Removed localStorage-based mock authentication
   - Integrated with real API via `auth.login()`
   - Shows API error messages (validation, network, credentials)
   - Navigates to `/admin` on successful login
   - Displays loading state during login

2. **`src/components/register-form/register-form.jsx`**
   - Removed localStorage-based mock registration
   - Integrated with real API via `auth.register()`
   - Handles FluentValidation errors from backend
   - Shows field-level error messages
   - Navigates to `/auth/login` on successful registration
   - Displays loading state during registration

### Admin

1. **`src/admin/AdminHeader.jsx`**
   - Displays logged-in user information (name, image, role)
   - Uses `userSummary` from auth context
   - Logout button calls `auth.logout()`

2. **`src/admin/admin-pages/NotAuthorized/NotAuthorized.jsx`**
   - Enhanced UI with proper 403 error display
   - Link to login page

### Routing

1. **`src/App.jsx`**
   - Wrapped application with `AuthProvider`
   - Ensures auth context available throughout app

2. **`src/AppRoutes.jsx`**
   - Protected `/admin/*` routes with `AdminProtectedRoute`
   - All admin pages require authentication
   - Public routes: `/`, `/auth/login`, `/auth/register`, etc.

## Configuration

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Or for Create React App compatibility:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Fallback:** If no environment variable is set, defaults to `http://localhost:5000`

### Backend Endpoints Expected

Base path: `/api/auth`

1. **POST /api/auth/register**
   - Body: `{ name, email, password }`
   - Success: `{ message, ...userData }`
   - Error 400: `{ errors: [{ propertyName, errorMessage }] }` (FluentValidation)

2. **POST /api/auth/login**
   - Body: `{ email, password }`
   - Success: `{ message: "Login successful", token: "<jwt>" }`
   - Error 401: Invalid credentials

3. **GET /api/auth/check-authorize**
   - Headers: `Authorization: Bearer <token>`
   - Success: `{ message: "This is a protected method..." }`
   - Error 401: Unauthorized

4. **POST /api/auth/get-user-summary**
   - Headers: `Authorization: Bearer <token>`
   - Body: `{ jwtTokenString: "<token>" }`
   - Success: `{ userId, role, username, userEmail, fullName, phoneNumber, imageUrl }`
   - Error 401: Token missing or invalid

## Usage Examples

### Login Flow

```jsx
import { useAuth } from '../hooks/useAuth';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login({ email, password });
      // Navigate to admin or dashboard
    } catch (error) {
      // Handle error (show message)
    }
  };
}
```

### Register Flow

```jsx
import { useAuth } from '../hooks/useAuth';

function RegisterComponent() {
  const { register } = useAuth();
  
  const handleRegister = async (name, email, password) => {
    try {
      await register({ name, email, password });
      // Navigate to login
    } catch (error) {
      // Handle FluentValidation errors
      if (error.response?.status === 400) {
        const errors = error.response.data.errors;
        // Display field-level errors
      }
    }
  };
}
```

### Access User Info

```jsx
import { useAuth } from '../hooks/useAuth';

function UserProfile() {
  const { userSummary, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {userSummary.fullName}</p>
      <p>Email: {userSummary.userEmail}</p>
      <p>Role: {userSummary.role}</p>
    </div>
  );
}
```

### Logout

```jsx
import { useAuth } from '../hooks/useAuth';

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Automatic Token Attachment**: All API requests include Bearer token
3. **401 Handling**: Auto-logout and redirect on unauthorized responses
4. **Route Protection**: Admin routes require authentication
5. **Token Validation**: User summary loaded on app init to verify token

## Development

### Install Dependencies

Make sure axios is installed:
```bash
npm install axios
```

### Start Backend

Ensure your ASP.NET Core backend is running on the configured port (default: 5000)

### Start Frontend

```bash
npm run dev
```

## Troubleshooting

### CORS Issues

Ensure your ASP.NET Core backend has CORS configured:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowReactApp");
```

### Token Not Persisting

Check browser localStorage in DevTools → Application → Local Storage

### 401 Errors

1. Verify token is being sent in Authorization header
2. Check backend JWT validation settings
3. Ensure token hasn't expired

### FluentValidation Errors Not Showing

Backend should return errors in this format:
```json
{
  "errors": [
    {
      "propertyName": "Email",
      "errorMessage": "Email is required"
    }
  ]
}
```

## Migration Notes

### Old Code Removed

- localStorage-based user authentication (`users` array)
- Mock admin login (`admin@gmail.com`)
- `isAdmin` flag in localStorage
- `currentUser` object in localStorage

### Backward Compatibility

Old localStorage data will not interfere with new JWT system. Users will need to re-register/login through the API.

## Next Steps

1. Set up `.env` file with your backend URL
2. Ensure backend is running and accessible
3. Test registration flow
4. Test login flow
5. Test admin access
6. Test logout functionality

## Support

For issues related to:
- **Frontend**: Check browser console for errors
- **Backend**: Check backend API logs
- **Network**: Use browser DevTools Network tab to inspect requests/responses
