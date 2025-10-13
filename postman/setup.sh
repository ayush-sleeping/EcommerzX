#!/bin/bash

# EcommerzX Postman Collection Setup Script
# This script helps set up the Postman collection for testing

echo "🚀 EcommerzX Postman Collection Setup"
echo "======================================"

# Check if Postman is installed
if command -v postman &> /dev/null; then
    echo "✅ Postman CLI detected"
else
    echo "⚠️  Postman CLI not found. Install from: https://www.postman.com/downloads/"
fi

# Check if Newman is installed
if command -v newman &> /dev/null; then
    echo "✅ Newman CLI detected"
else
    echo "📦 Installing Newman CLI..."
    npm install -g newman
fi

echo ""
echo "📁 Available Files:"
echo "   - Collection: postman/EcommerzX-API-Collection.json"
echo "   - Local Environment: postman/EcommerzX-Local-Environment.json"
echo "   - Production Environment: postman/EcommerzX-Production-Environment.json"
echo "   - Documentation: postman/README.md"

echo ""
echo "🔧 Quick Setup Steps:"
echo "   1. Import Collection: postman/EcommerzX-API-Collection.json"
echo "   2. Import Environment: postman/EcommerzX-Local-Environment.json"
echo "   3. Set Environment as active in Postman"
echo "   4. Run Authentication flow to get access token"

echo ""
echo "🧪 Test Collection via Newman:"
echo "   newman run postman/EcommerzX-API-Collection.json \\"
echo "     -e postman/EcommerzX-Local-Environment.json \\"
echo "     --reporters cli,html \\"
echo "     --reporter-html-export newman-report.html"

echo ""
echo "📚 Documentation: See postman/README.md for complete guide"
echo ""
echo "✅ Setup complete! Import the files into Postman to get started."
