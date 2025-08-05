#!/bin/bash

# BiasGuard Code Development Server Startup Script
# Cross-platform development server launcher

echo "🚀 Starting BiasGuard Code Development Environment"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${YELLOW}⚠️  Node.js version is $NODE_VERSION, recommended 16+${NC}"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/ws/package.json" ]; then
    echo -e "${BLUE}📦 Installing development dependencies...${NC}"
    npm run setup
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Failed to install WebSocket dependency, falling back to basic server${NC}"
    fi
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ index.html not found${NC}"
    echo "Please ensure the landing page file exists"
    exit 1
fi

# Display system information
echo -e "${BLUE}📋 System Information:${NC}"
echo "   Node.js: $(node -v)"
echo "   NPM: $(npm -v)"
echo "   OS: $(uname -s)"
echo "   Directory: $(pwd)"
echo ""

# Start the development server
echo -e "${GREEN}🔄 Starting development server with live reload...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Try to start the Node.js dev server, fallback to alternatives
if npm run dev 2>/dev/null; then
    echo -e "${GREEN}✅ Development server started successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js dev server failed, trying alternatives...${NC}"
    
    # Try npx serve
    if command -v npx &> /dev/null; then
        echo -e "${BLUE}🔄 Trying npx serve...${NC}"
        npx serve -s . -l 3009
    # Try Python 3
    elif command -v python3 &> /dev/null; then
        echo -e "${BLUE}🔄 Trying Python 3 server...${NC}"
        echo -e "${YELLOW}⚠️  Live reload not available with Python server${NC}"
        python3 -m http.server 3009
    # Try Python 2
    elif command -v python &> /dev/null; then
        echo -e "${BLUE}🔄 Trying Python 2 server...${NC}"
        echo -e "${YELLOW}⚠️  Live reload not available with Python server${NC}"
        python -m SimpleHTTPServer 3009
    else
        echo -e "${RED}❌ No suitable server found${NC}"
        echo "Please install Node.js, Python, or serve globally:"
        echo "  npm install -g serve"
        exit 1
    fi
fi 