#!/bin/bash
# Simple build script for PROJECT01 Traffic Light application

set -e  # Exit on any error

echo "🚀 Starting PROJECT01 build process..."

# Create build directory
echo "📁 Creating build directory..."
mkdir -p build

# Validate HTML files
echo "✅ Validating HTML files..."
if [ -f "index.html" ]; then
    echo "   ✓ index.html found"
else
    echo "   ❌ index.html missing"
    exit 1
fi

if [ -f "demo.html" ]; then
    echo "   ✓ demo.html found"
else
    echo "   ❌ demo.html missing"
    exit 1
fi

# Validate JavaScript and CSS files
echo "✅ Validating JavaScript and CSS files..."
if [ -f "script.js" ]; then
    echo "   ✓ script.js found"
else
    echo "   ❌ script.js missing"
    exit 1
fi

if [ -f "style.css" ]; then
    echo "   ✓ style.css found"
else
    echo "   ❌ style.css missing"
    exit 1
fi

# Copy files to build directory
echo "📋 Copying files to build directory..."
cp index.html build/
cp demo.html build/
cp script.js build/
cp style.css build/
cp README.md build/
if [ -f "first" ]; then
    cp first build/
fi

# Validate JavaScript syntax (basic check)
echo "🔍 Running basic JavaScript syntax check..."
if command -v node >/dev/null 2>&1; then
    node -c script.js && echo "   ✓ JavaScript syntax is valid"
else
    echo "   ⚠️  Node.js not available, skipping JS syntax check"
fi

# Create build info
echo "📄 Creating build info..."
cat > build/build-info.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "files": [
    "index.html",
    "demo.html", 
    "script.js",
    "style.css",
    "README.md"
  ],
  "buildType": "static-web-app"
}
EOF

echo "✅ Build completed successfully!"
echo "📦 Build artifacts are in the 'build' directory"
echo "🌐 You can serve the files from 'build' directory using any web server"