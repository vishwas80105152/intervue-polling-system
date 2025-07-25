#!/bin/bash

echo "🚀 Intervue Polling System - Deployment Script"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Build the client
echo "📦 Building React client..."
cd client
npm run build
cd ..

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🌐 Choose your deployment option:"
echo ""
echo "1. Vercel (Frontend) + Railway (Backend) - Recommended"
echo "2. Netlify (Frontend) + Render (Backend)"
echo "3. Heroku (Full Stack)"
echo ""
echo "📋 Next steps:"
echo ""
echo "For Option 1 (Vercel + Railway):"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Railway:"
echo "   - Go to railway.app"
echo "   - Create new project"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to '/server'"
echo "   - Add env vars: NODE_ENV=production, CLIENT_URL=your-frontend-url"
echo ""
echo "3. Deploy frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set root directory to '/client'"
echo "   - Add env var: REACT_APP_SERVER_URL=your-backend-url"
echo ""
echo "For Option 2 (Netlify + Render):"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Render:"
echo "   - Go to render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to '/server'"
echo "   - Build: npm install, Start: npm start"
echo ""
echo "3. Deploy frontend to Netlify:"
echo "   - Go to netlify.com"
echo "   - Import your GitHub repo"
echo "   - Set root directory to '/client'"
echo "   - Build: npm run build, Publish: build"
echo ""
echo "For Option 3 (Heroku):"
echo "1. Install Heroku CLI: npm install -g heroku"
echo "2. Login: heroku login"
echo "3. Create app: heroku create your-app-name"
echo "4. Set env vars: heroku config:set NODE_ENV=production"
echo "5. Deploy: git push heroku main"
echo ""
echo "📖 See README.md for detailed deployment instructions"
echo ""
echo "🎉 Good luck with your deployment!" 