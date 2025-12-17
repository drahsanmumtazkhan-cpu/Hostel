# Hostel Management System

## Project Overview
A modern Next.js application for managing hostels with authentication and a clean user interface.

## Features
✅ User Authentication (Login/Signup)
✅ Auto-redirect to login on localhost:3000
✅ Toast notifications for all actions
✅ Modern, responsive UI with Tailwind CSS
✅ Hostel listing with grid layout
✅ Add hostel modal
✅ User session management
✅ Logout functionality

## Project Structure
```
/app
  /api
    /auth
      route.ts          # Authentication API (POST: signup, PUT: login)
    /addhostel
      route.ts          # Hostel API (POST: add, GET: list)
  /hostels
    page.tsx            # Main hostels dashboard
  /login
    page.tsx            # Login page
  /signup
    page.tsx            # Signup page
  page.tsx              # Root page (redirects to login)
  layout.tsx            # Root layout with metadata
  globals.css           # Global styles

/lib
  mongodb.ts            # MongoDB connection

/models
  User.ts               # User model
  Hostel.ts             # Hostel model
```

## User Flow
1. **localhost:3000** → Auto redirects to `/login`
2. **Login Page** → User can login or click "Sign up" link below
3. **Signup Page** → User creates account → Redirects to login
4. **Hostels Dashboard** → Shows all hostels + "Add Hostel" button
5. **Add Hostel Modal** → Opens modal to add new hostel
6. **Logout** → Returns to login page

## Technologies Used
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **MongoDB + Mongoose** - Database
- **bcryptjs** - Password hashing
- **react-hot-toast** - Toast notifications

## Design Features
- Gradient backgrounds (blue to indigo)
- Modern card-based UI
- Hover effects and transitions
- Responsive design
- Professional buttons with gradients
- Modal overlays
- Clean typography

## Running the Project
```bash
npm install
npm run dev
```
Access at: http://localhost:3000

## API Endpoints

### Authentication
- **POST /api/auth** - Signup (body: name, username, password)
- **PUT /api/auth** - Login (body: username, password)

### Hostels
- **GET /api/addhostel** - Get all hostels
- **POST /api/addhostel** - Add hostel (body: name, address, owner)

## Toast Notifications
- ✅ Login successful
- ✅ Signup successful
- ✅ Hostel added successfully
- ✅ Logged out successfully
- ❌ Error messages for failures
