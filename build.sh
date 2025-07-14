#!/bin/bash

echo "🚀 Building Gallery MKIII..."

# Check if source images exist
if [ ! -d "All-DrawingsCompressed" ]; then
    echo "❌ Error: All-DrawingsCompressed folder not found!"
    echo "   Please ensure your source PNG images are in this folder."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "   Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Convert images to WebP
echo "🖼️  Converting images to WebP..."
npm run convert

if [ $? -eq 0 ]; then
    echo "✅ WebP conversion completed successfully!"
    
    # Ask user if they want to delete original PNGs
    read -p "🗑️  Delete original PNG files to save space? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run cleanup
        echo "✅ Original PNG files cleaned up!"
    else
        echo "ℹ️  Original PNG files kept (you can delete them later with 'npm run cleanup')"
    fi
    
    echo ""
    echo "🎉 Build complete! Your gallery is ready."
    echo "📝 To test locally, run: npm run serve"
    echo "🌐 Then visit: http://localhost:8000"
else
    echo "❌ Build failed during WebP conversion!"
    exit 1
fi
