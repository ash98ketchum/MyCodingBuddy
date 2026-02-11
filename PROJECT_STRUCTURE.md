# MyCodingBuddy - Complete File Structure

## 📁 Project Root
```
MyCodingBuddy/
├── .git/                           # Git version control directory
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── render.yaml                     # Render deployment configuration
├── backend/                        # Backend Node.js/Express application
└── frontend/                       # Frontend React/Vite application
```

---

## 🔧 Backend Structure

```
backend/
├── .dockerignore                   # Docker ignore rules
├── .env                           # Environment variables (private)
├── .env.example                   # Environment variables template
├── Dockerfile                     # Docker container configuration
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # NPM dependency lock file
├── tsconfig.json                  # TypeScript configuration
├── node_modules/                  # NPM dependencies (auto-generated)
│
├── prisma/                        # Database schema and seeding
│   ├── schema.prisma              # Prisma database schema
│   ├── seed-admin.ts              # Admin user seeding script
│   └── seed-problems.ts           # Problem data seeding script
│
└── src/                           # Source code
    ├── index.ts                   # Main application entry point
    │
    ├── config/                    # Configuration files
    │   ├── database.ts            # Database connection config
    │   ├── index.ts               # Config exports
    │   └── redis.ts               # Redis connection config
    │
    ├── controllers/               # Request handlers
    │   ├── admin.controller.ts    # Admin operations
    │   ├── auth.controller.ts     # Authentication logic
    │   ├── problem.controller.ts  # Problem CRUD operations
    │   └── submission.controller.ts # Code submission handling
    │
    ├── middleware/                # Express middleware
    │   ├── auth.ts                # Authentication middleware
    │   ├── error.ts               # Error handling middleware
    │   └── validate.ts            # Request validation middleware
    │
    ├── routes/                    # API route definitions
    │   ├── admin.routes.ts        # Admin API routes
    │   ├── auth.routes.ts         # Authentication routes
    │   ├── problem.routes.ts      # Problem routes
    │   └── submission.routes.ts   # Submission routes
    │
    ├── services/                  # Business logic layer
    │   └── judge.service.ts       # Code execution judge service
    │
    ├── utils/                     # Utility functions
    │   ├── jwt.ts                 # JWT token utilities
    │   └── password.ts            # Password hashing utilities
    │
    └── worker/                    # Background job processing
        ├── executor.ts            # Code execution engine
        └── index.ts               # Worker main file
```

---

## 🎨 Frontend Structure

```
frontend/
├── .dockerignore                  # Docker ignore rules
├── .env.local                     # Local environment variables
├── Dockerfile                     # Docker container configuration
├── index.html                     # HTML entry point
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # NPM dependency lock file
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # TypeScript config for Node
├── vite.config.ts                 # Vite bundler configuration
├── node_modules/                  # NPM dependencies (auto-generated)
│
└── src/                           # Source code
    ├── App.tsx                    # Main React application component
    ├── main.tsx                   # React application entry point
    ├── index.css                  # Global CSS styles
    │
    ├── components/                # Reusable React components
    │   ├── CodeEditor.tsx         # Monaco code editor component
    │   ├── Footer.tsx             # Footer component
    │   ├── Navbar.tsx             # Navigation bar component
    │   ├── TestResults.tsx        # Test results display component
    │   │
    │   └── ui/                    # UI component library
    │       ├── Badge.tsx          # Badge component
    │       ├── Button.tsx         # Button component
    │       ├── Card.tsx           # Card component
    │       ├── Input.tsx          # Input component
    │       ├── Skeleton.tsx       # Loading skeleton component
    │       ├── Tooltip.tsx        # Tooltip component
    │       └── index.ts           # UI components exports
    │
    ├── pages/                     # Page-level components
    │   ├── AdminDashboard.tsx     # Admin dashboard page
    │   ├── HomePage.tsx           # Landing/home page
    │   ├── LeaderboardPage.tsx    # User rankings page
    │   ├── LoginPage.tsx          # User login page
    │   ├── ProblemPage.tsx        # Individual problem solving page
    │   ├── ProblemsPage.tsx       # Problems list page
    │   ├── ProfilePage.tsx        # User profile page
    │   └── RegisterPage.tsx       # User registration page
    │
    ├── services/                  # API communication layer
    │   └── api.ts                 # API client and endpoints
    │
    ├── store/                     # State management (Zustand)
    │   └── index.ts               # Global state store
    │
    └── types/                     # TypeScript type definitions
        └── index.ts               # Type definitions
```

---

## 📊 Key Architecture Overview

### **Backend Stack**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Cache:** Redis
- **Authentication:** JWT-based auth
- **Code Execution:** Custom worker with Docker containers

### **Frontend Stack**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor
- **State Management:** Zustand
- **Routing:** React Router

### **Deployment**
- **Platform:** Render (via render.yaml)
- **Containerization:** Docker (Dockerfile in both backend/frontend)

---

## 🔑 Core Features

1. **Authentication System** - User registration, login, JWT tokens
2. **Problem Management** - CRUD operations for coding problems
3. **Code Execution** - Real-time code execution and testing
4. **Leaderboard** - User rankings and statistics
5. **Admin Dashboard** - Problem management interface
6. **Test Results** - Detailed test case execution feedback

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `render.yaml` | Render platform deployment config |
| `tsconfig.json` | TypeScript compiler settings |
| `tailwind.config.js` | Tailwind CSS customization |
| `vite.config.ts` | Vite bundler configuration |
| `prisma/schema.prisma` | Database schema definition |
| `.env.example` | Environment variables template |

---

**Total Files:** ~50+ source files across backend and frontend
**Languages:** TypeScript, CSS, Prisma Schema
**Architecture:** Full-stack monorepo with REST API
