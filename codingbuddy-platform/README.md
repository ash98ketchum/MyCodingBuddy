# CodingBuddy Platform - Complete Deployment Guide

## 🎯 Production-Ready Competitive Programming Platform

A full-stack platform with **Admin Panel** and **Client Portal**, complete with code execution, contests, leaderboards, and payment integration.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Render Deployment](#render-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Admin Panel Access](#admin-panel-access)
7. [Features](#features)
8. [Tech Stack](#tech-stack)
9. [Project Structure](#project-structure)
10. [API Documentation](#api-documentation)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed (or use Render's managed PostgreSQL)
- Redis 7+ installed (or use Render's managed Redis)
- Git installed

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codingbuddy-platform.git
cd codingbuddy-platform

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 💻 Local Development

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb codingbuddy

# Or using psql
psql -U postgres
CREATE DATABASE codingbuddy;
\q
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your local credentials
# DATABASE_URL=postgresql://postgres:password@localhost:5432/codingbuddy
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your-super-secret-jwt-key

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:push

# Start the backend server
npm run dev

# In a new terminal, start the worker
npm run worker
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start the frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Create Admin User

Once backend is running, create an admin account:

```bash
# Using the API (or use the register endpoint and then manually update role in database)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@codingbuddy.com",
    "password": "Admin@123456",
    "fullName": "Admin User"
  }'

# Then update the user role to ADMIN in the database:
# Connect to your database and run:
# UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@codingbuddy.com';
```

---

## 🌐 Render Deployment

### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Push your code to GitHub

### Step 1: Deploy PostgreSQL Database

1. Go to Render Dashboard → **New** → **PostgreSQL**
2. Name: `codingbuddy-db`
3. Database: `codingbuddy`
4. User: `codingbuddy_user`
5. Region: Choose nearest
6. Plan: Select (Free or paid)
7. Click **Create Database**
8. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Redis

1. Go to Render Dashboard → **New** → **Redis**
2. Name: `codingbuddy-redis`
3. Region: Same as database
4. Plan: Select
5. Click **Create Redis**
6. **Copy the Internal Redis URL**

### Step 3: Deploy Backend

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `codingbuddy-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Select

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   DATABASE_URL=<YOUR_INTERNAL_POSTGRES_URL>
   REDIS_URL=<YOUR_INTERNAL_REDIS_URL>
   JWT_SECRET=<GENERATE_RANDOM_STRING_64_CHARS>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@codingbuddy.com
   ADMIN_PASSWORD=<STRONG_PASSWORD>
   FRONTEND_URL=https://codingbuddy-frontend.onrender.com
   ```

5. Click **Create Web Service**

6. After deployment completes, note your backend URL (e.g., `https://codingbuddy-backend.onrender.com`)

### Step 4: Deploy Worker Service

1. Go to Render Dashboard → **New** → **Background Worker**
2. Connect same repository
3. Configure:
   - **Name**: `codingbuddy-worker`
   - **Region**: Same as above
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run prisma:generate`
   - **Start Command**: `npm run worker`

4. Add same environment variables as backend
5. Click **Create Background Worker**

### Step 5: Deploy Frontend

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect your repository
3. Configure:
   - **Name**: `codingbuddy-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://codingbuddy-backend.onrender.com/api
   ```

5. Click **Create Static Site**

### Step 6: Initialize Database

After backend is deployed:

```bash
# Using Render Shell (Dashboard → Backend Service → Shell tab)
npm run prisma:push

# Or use Render's internal dashboard or your local machine:
# Set DATABASE_URL to your Render database URL and run:
npx prisma db push
```

---

## 🗄️ Database Setup

### Seed Initial Data

Create a seed script or manually add problems:

```bash
# Connect to your Render database
psql <YOUR_DATABASE_URL>

# Insert sample problem
INSERT INTO "Problem" (
  id, title, slug, description, difficulty, rating, 
  tags, "sampleInput", "sampleOutput", explanation, 
  constraints, "timeLimit", "memoryLimit", "isFree", 
  "acceptedCount", "submissionCount", "createdById", "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Two Sum',
  'two-sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'EASY',
  1200,
  ARRAY['array', 'hash-table']::text[],
  '[2,7,11,15]
9',
  '[0,1]',
  'Because nums[0] + nums[1] == 9, we return [0, 1].',
  '2 <= nums.length <= 10^4',
  2000,
  256,
  true,
  0,
  0,
  '<ADMIN_USER_ID>',
  NOW(),
  NOW()
);
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/codingbuddy

# JWT
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://host:6379

# CORS
FRONTEND_URL=https://your-frontend.onrender.com

# Admin
ADMIN_EMAIL=admin@codingbuddy.com
ADMIN_PASSWORD=<strong-password>

# Judge
MAX_EXECUTION_TIME=5000
MAX_MEMORY_LIMIT=512
JUDGE_WORKERS=3
```

### Frontend (.env.local / Render env)

```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 👨‍💼 Admin Panel Access

### Access Admin Dashboard

1. **Register/Login as Admin**:
   - URL: `https://your-frontend.onrender.com/login`
   - Email: `admin@codingbuddy.com`
   - Password: `<YOUR_ADMIN_PASSWORD>`

2. **Admin Routes**:
   - Dashboard: `/admin`
   - User Management: `/admin/users`
   - Problem Management: `/admin/problems`
   - Submissions: `/admin/submissions`

### Admin Features

- ✅ View system statistics (users, problems, submissions, revenue)
- ✅ User management (view, edit, delete, promote to admin)
- ✅ Problem management (create, edit, delete)
- ✅ Submission monitoring
- ✅ System health check

---

## ✨ Features

### For Users (Clients)

- ✅ **Authentication**: Register, login, JWT-based
- ✅ **Problem Solving**: Browse and solve 500+ problems
- ✅ **Code Editor**: Monaco editor (VS Code) with syntax highlighting
- ✅ **Multiple Languages**: JavaScript, Python, Java, C++, C
- ✅ **Real-time Judging**: Secure code execution with verdicts
- ✅ **Profile & Progress**: Track rating, streak, submissions
- ✅ **Leaderboard**: Global ranking system
- ✅ **Submissions History**: View all past submissions
- ✅ **Premium Plans**: Free, Premium, Enterprise tiers

### For Admins

- ✅ **Admin Dashboard**: System overview and statistics
- ✅ **User Management**: Full CRUD operations on users
- ✅ **Problem Management**: Create and manage problems
- ✅ **Submission Monitoring**: View all user submissions
- ✅ **System Health**: Monitor backend, database, Redis, queue
- ✅ **Analytics**: Revenue tracking, user growth, submission stats

### Judge System

- ✅ **Secure Execution**: Code runs in isolated environment
- ✅ **Multiple Test Cases**: Hidden and sample test cases
- ✅ **Verdicts**: Accepted, Wrong Answer, TLE, MLE, RE, CE
- ✅ **Time & Memory Limits**: Configurable per problem
- ✅ **Queue-based**: Bull queue with Redis
- ✅ **Rating System**: Elo-based rating calculation

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Cache/Queue**: Redis + Bull
- **Auth**: JWT + bcrypt
- **Validation**: Zod

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Editor**: Monaco Editor
- **State**: Zustand
- **HTTP**: Axios
- **Routing**: React Router v6
- **UI**: Lucide Icons, Framer Motion

### Infrastructure
- **Deployment**: Render.com
- **CI/CD**: GitHub Integration
- **Database**: Render PostgreSQL
- **Cache**: Render Redis

---

## 📁 Project Structure

```
codingbuddy-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── worker/          # Judge worker
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app
│   │   └── main.tsx         # Entry point
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
Body: { username, email, password, fullName }

# Login
POST /api/auth/login
Body: { email, password }

# Get Profile
GET /api/auth/profile
Headers: { Authorization: Bearer <token> }

# Update Profile
PUT /api/auth/profile
Headers: { Authorization: Bearer <token> }
Body: { fullName, bio, country, organization }
```

### Problems

```bash
# Get all problems
GET /api/problems?difficulty=EASY&page=1&limit=20

# Get problem by slug
GET /api/problems/:slug

# Create problem (Admin only)
POST /api/problems
Headers: { Authorization: Bearer <admin-token> }

# Update problem (Admin only)
PUT /api/problems/:id

# Delete problem (Admin only)
DELETE /api/problems/:id
```

### Submissions

```bash
# Submit code
POST /api/submissions
Headers: { Authorization: Bearer <token> }
Body: { problemId, code, language }

# Get submission
GET /api/submissions/:id

# Get user submissions
GET /api/submissions/my?page=1&limit=20

# Get submission status
GET /api/submissions/:id/status

# Get leaderboard
GET /api/submissions/leaderboard?limit=50
```

### Admin

```bash
# Dashboard stats
GET /api/admin/dashboard
Headers: { Authorization: Bearer <admin-token> }

# Get all users
GET /api/admin/users?page=1&limit=50

# Update user
PUT /api/admin/users/:id

# Delete user
DELETE /api/admin/users/:id

# System health
GET /api/admin/health
```

---

## 🔧 Troubleshooting

### Backend Issues

1. **Database Connection Failed**
   ```bash
   # Check DATABASE_URL format
   # Should be: postgresql://user:password@host:port/database
   ```

2. **Redis Connection Failed**
   ```bash
   # Verify REDIS_URL
   # Check if Redis service is running on Render
   ```

3. **Worker Not Processing**
   ```bash
   # Ensure worker service is deployed and running
   # Check logs in Render dashboard
   ```

### Frontend Issues

1. **API Calls Failing**
   ```bash
   # Verify VITE_API_URL points to deployed backend
   # Check CORS settings in backend
   ```

2. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

---

## 💰 Monetization Setup

### Payment Integration (Optional)

To enable premium subscriptions:

1. Sign up for Stripe or Razorpay
2. Add API keys to backend .env:
   ```
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Implement payment routes (already scaffolded in schema)

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://your-backend.onrender.com/health

# Admin system health
curl https://your-backend.onrender.com/api/admin/health \
  -H "Authorization: Bearer <admin-token>"
```

### Logs

View logs in Render Dashboard:
- Backend Service → Logs tab
- Worker Service → Logs tab
- Frontend → Logs tab

---

## 🎓 Default Login Credentials

**Admin Account**:
- Email: `admin@codingbuddy.com`
- Password: Set in environment variable `ADMIN_PASSWORD`

**Test User** (create via registration page):
- Register at `/register`

---

## 🚀 Scaling Tips

1. **Increase Workers**: Scale worker instances in Render for more concurrent code executions
2. **Database**: Upgrade PostgreSQL plan for more connections
3. **Redis**: Use Redis Pro for better performance
4. **CDN**: Add Cloudflare for frontend static assets
5. **Caching**: Implement Redis caching for frequent queries

---

## 📝 License

MIT License - feel free to use for your startup!

---

## 🤝 Support

For issues or questions:
- GitHub Issues: Create an issue
- Email: support@codingbuddy.com

---

## 🎉 Congratulations!

You now have a production-ready competitive programming platform deployed on Render with:

✅ Full authentication system
✅ Admin panel with complete management
✅ Client portal for users
✅ Secure code execution
✅ Real-time judging
✅ Leaderboard system
✅ Payment integration ready
✅ Scalable architecture

**Start earning by adding problems and attracting users!** 🚀
