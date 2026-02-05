# 🚀 CodingBuddy - Complete Setup Guide

## Download & Extract

1. Download: `codingbuddy-complete.tar.gz`
2. Extract: `tar -xzf codingbuddy-complete.tar.gz`
3. Navigate: `cd codingbuddy-platform`

## Quick Deploy to Render (10 Minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/codingbuddy-platform.git
git push -u origin main

# 2. Go to render.com
# 3. New → Blueprint → Connect GitHub → Select repo
# 4. Set ADMIN_PASSWORD in backend environment
# 5. Wait for deployment
# 6. Access at: https://codingbuddy-frontend.onrender.com
```

## Login as Admin

- Email: `admin@codingbuddy.com`
- Password: (your ADMIN_PASSWORD)

## Project Structure

```
codingbuddy-platform/
├── backend/          # Node.js API + Judge System
├── frontend/         # React Application
├── README.md         # Full documentation
├── DEPLOYMENT.md     # Deployment guide
└── render.yaml       # Auto-deployment config
```

## Features

✅ Admin Panel (user/problem management, analytics)
✅ Client Portal (problem solving, leaderboard)
✅ Monaco Code Editor (VS Code interface)
✅ 5 Languages (JS, Python, Java, C++, C)
✅ Secure Judge System (isolated execution)
✅ JWT Authentication
✅ Payment Ready (Stripe/Razorpay)

## Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run prisma:push
npm run dev

# Worker (new terminal)
cd backend
npm run worker

# Frontend (new terminal)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

## Support

See README.md for complete documentation!
