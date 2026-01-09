# Quick Setup Guide

## 1. Configure Backend URL

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your ASP.NET Core backend URL.

## 2. Install Dependencies

Dependencies have been installed. If needed:

```bash
npm install
```

## 3. Start the Application

```bash
npm run dev
```

## 4. Test Authentication

### Register a New User
1. Navigate to `/auth/register`
2. Fill in: Name, Email, Password
3. Click "Qeydiyyat"
4. On success, you'll be redirected to login

### Login
1. Navigate to `/auth/login`
2. Enter your credentials
3. Click "Daxil ol"
4. On success, you'll be redirected to `/admin`

### Access Admin Panel
1. After login, you'll see the admin dashboard
2. User info (name, role, image) will be displayed in the header
3. Click "Logout" to sign out

## 5. Verify Backend Connection

Open browser DevTools (F12) → Network tab to see API requests:
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login
- `POST /api/auth/get-user-summary` - Get user details
- `GET /api/auth/check-authorize` - Check authorization

## Routes

### Public Routes
- `/` - Home page
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/wine`, `/whiskey`, `/vodka`, `/cognac` - Product pages

### Protected Routes (Require Login)
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/categories` - Manage categories
- `/admin/*` - All admin pages

### Special Routes
- `/not-authorized` - Shown when user lacks permissions

## Common Issues

### "Cannot connect to server"
- Ensure backend is running
- Check `VITE_API_BASE_URL` in `.env` file
- Verify CORS is configured in backend

### "401 Unauthorized"
- Token may have expired
- Try logging in again

### FluentValidation errors not showing
- Check backend response format
- Errors should be array: `[{ propertyName, errorMessage }]`

## File Structure

```
src/
├── data/
│   ├── apiClient.js         # Axios client with interceptors
│   ├── authApi.js           # Authentication API functions
│   └── tokenStorage.js      # Token management
├── hooks/
│   ├── AuthContext.jsx      # Auth state provider
│   └── useAuth.js           # Auth hook
├── admin/
│   ├── admin-components/
│   │   └── AdminProtectedRoute.jsx  # Route protection
│   ├── AdminHeader.jsx      # Updated with user info
│   └── ...
├── components/
│   ├── login-form/
│   │   └── login-form.jsx   # Updated with API integration
│   └── register-form/
│       └── register-form.jsx # Updated with API integration
└── ...
```

## Documentation

See [AUTH_INTEGRATION.md](AUTH_INTEGRATION.md) for detailed documentation.
