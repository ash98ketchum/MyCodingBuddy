#!/bin/bash

# CodingBuddy Platform - Development Startup Script

echo "🚀 Starting CodingBuddy Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL 14+${NC}"
    exit 1
fi

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo -e "${RED}❌ Redis is not installed. Please install Redis 7+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo -e "${BLUE}📝 Creating backend .env from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${RED}⚠️  Please edit backend/.env with your credentials${NC}"
    exit 1
fi

if [ ! -f frontend/.env.local ]; then
    echo -e "${BLUE}📝 Creating frontend .env.local...${NC}"
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env.local
fi

echo -e "${GREEN}✅ Environment files ready${NC}"
echo ""

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma client
echo -e "${BLUE}🔧 Generating Prisma client...${NC}"
cd backend && npm run prisma:generate

# Push database schema
echo -e "${BLUE}🗄️  Setting up database...${NC}"
npm run prisma:push
cd ..

echo -e "${GREEN}✅ Database ready${NC}"
echo ""

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC} http://localhost:5000"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}Worker:${NC} Running in background"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Start all services using npm-run-all or concurrently
cd backend && npm run dev & 
BACKEND_PID=$!

cd backend && npm run worker &
WORKER_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait for Ctrl+C
trap "echo '';echo 'Stopping services...'; kill $BACKEND_PID $WORKER_PID $FRONTEND_PID; exit" INT

wait
