#!/bin/bash

# Lootdrop Setup Script
echo "🚀 Setting up Lootdrop..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Setup backend
echo "📦 Setting up backend..."
cd server

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/lootdrop

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789

# Steam API (optional for now)
STEAM_API_KEY=your_steam_api_key_here

# Port
PORT=5000
EOF
    echo "✅ Created .env file. Please update the values as needed."
else
    echo "✅ .env file already exists."
fi

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd server"
echo "  npm run dev"
echo ""

# Setup frontend
echo "📦 Setting up frontend..."
cd ../client

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo ""
echo "🎉 Frontend setup complete!"
echo ""
echo "To start the frontend:"
echo "  cd client"
echo "  npm start"
echo ""

# Final instructions
echo "🚀 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start MongoDB (if not already running)"
echo "2. Start the backend server:"
echo "   cd server && npm run dev"
echo "3. In a new terminal, start the frontend:"
echo "   cd client && npm start"
echo ""
echo "🔑 Test User Credentials:"
echo "   Customer: john@lootdrop.com / password123"
echo "   Customer: sarah@lootdrop.com / password123"  
echo "   Customer: mike@lootdrop.com / password123"
echo "   Admin: admin@lootdrop.com / admin123"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "Happy trading! 🎮✨"
