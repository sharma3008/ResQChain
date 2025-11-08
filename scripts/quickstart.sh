#!/bin/bash

# ResQChain Quick Start Script
# This script helps you get started with ResQChain quickly

set -e

echo "🚑 ResQChain Quick Start"
echo "========================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm --version)"

echo ""
echo "================================"
echo "✅ ResQChain prerequisites OK!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Install dependencies: npm install"
echo "2. Copy .env.example to .env and configure"
echo "3. Start services: docker-compose up -d"
echo "4. Start dev server: npm run dev"
echo ""
echo "🚑 Ready to save lives with ResQChain!"
