# Admin Authentication Setup Guide

## Quick Setup Instructions

### 1. Generate Admin Password Hash

Run the password hash generator script:

```bash
node scripts/hash-password.js
```

Enter your desired admin password (minimum 8 characters). The script will output environment variables for you to copy.

### 2. Create Environment File

Create a file named `.env.local` in the root directory with the following content:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<paste the hash from step 1>
JWT_SECRET=<paste the JWT secret from step 1>
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Restart Development Server

Stop and restart your development server to load the new environment variables:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 4. Access Admin Login

Navigate to: **http://localhost:3000/admin**

You will be automatically redirected to the login page. Use the credentials you set up:
- **Username**: admin (or whatever you set in ADMIN_USERNAME)
- **Password**: The password you entered in step 1

## How Authentication Works

### Login Flow
1. User enters credentials on `/admin/login`
2. Credentials are verified against environment variables
3. JWT token is created and stored in HTTP-only cookie
4. User is redirected to `/admin` dashboard

### Route Protection
- Middleware checks for valid JWT on all `/admin/*` routes
- Invalid or missing tokens redirect to `/admin/login`
- Login page and auth API routes are excluded from protection

### Logout Flow
1. User clicks "Logout" button in sidebar
2. Session cookie is cleared
3. User is redirected to `/admin/login`

## Security Features

✅ **HTTP-only cookies** - Prevents XSS attacks  
✅ **Bcrypt password hashing** - Secure password storage  
✅ **JWT tokens** - Stateless authentication  
✅ **Server-side middleware** - Route protection at the edge  
✅ **7-day session expiry** - Automatic logout after inactivity  

## Troubleshooting

### "Invalid username or password" error
- Check that `.env.local` exists and contains the correct hash
- Verify you're using the same password you entered when generating the hash
- Restart the dev server after creating/modifying `.env.local`

### Redirected to login after successful login
- Check browser console for errors
- Verify JWT_SECRET is set in `.env.local`
- Clear browser cookies and try again

### "ADMIN_PASSWORD_HASH not set" in server logs
- Ensure `.env.local` exists in the root directory
- Restart the development server
- Check that the file is named exactly `.env.local` (not `.env` or `.env.development`)

## Changing Admin Password

To change the admin password:

1. Run `node scripts/hash-password.js` again
2. Enter your new password
3. Update `ADMIN_PASSWORD_HASH` in `.env.local`
4. Restart the dev server

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Use a strong, unique password
3. Generate a new JWT_SECRET for production
4. Ensure `.env.local` is never committed to version control

## Files Created

- `lib/auth.ts` - Authentication utilities
- `app/admin/login/page.tsx` - Login page
- `app/api/admin/auth/login/route.ts` - Login API
- `app/api/admin/auth/logout/route.ts` - Logout API
- `middleware.ts` - Route protection
- `scripts/hash-password.js` - Password hash generator
