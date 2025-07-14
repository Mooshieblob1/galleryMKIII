#!/bin/bash

# Gallery MKIII Setup Script
# This script sets up WebP conversion and lazy loading for your gallery

echo "🎨 Gallery MKIII - WebP & Lazy Loading Setup"
echo "============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "📥 Please install Node.js from: https://nodejs.org/"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo ""

# Check if source directories exist
if [ ! -d "All-DrawingsCompressed" ]; then
    echo "⚠️  Warning: All-DrawingsCompressed directory not found."
    echo "   Make sure your PNG images are in this folder before converting."
fi

if [ ! -d "All-Drawings" ]; then
    echo "⚠️  Warning: All-Drawings directory not found."
    echo "   Make sure your full-size PNG images are in this folder before converting."
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. 📁 Make sure your PNG images are in:"
echo "   - All-DrawingsCompressed/ (for thumbnails)"
echo "   - All-Drawings/ (for full-size images)"
echo ""
echo "2. 🔄 Convert images to WebP:"
echo "   npm run convert"
echo ""
echo "3. 🌐 Test your site:"
echo "   npm run serve"
echo "   Then visit: http://localhost:8000"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""
echo "✨ Happy coding!"
