#!/bin/bash

echo "🚀 Deploying Intervue Polling App to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote repository found!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a GitHub repository at: https://github.com/new"
    echo "2. Run: git remote add origin YOUR_GITHUB_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Go to https://render.com and connect your repository"
    echo ""
    echo "🎯 Or use the quick deploy method:"
    echo "1. Go to https://render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub account"
    echo "4. Select this repository"
    echo "5. Set build command: npm run install-all && npm run build"
    echo "6. Set start command: npm start"
    echo "7. Click 'Create Web Service'"
else
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Update for deployment"
    git push origin main
    echo "✅ Code pushed to GitHub!"
    echo "🌐 Your app will be deployed automatically on Render"
fi

echo ""
echo "🎉 Deployment setup complete!"
echo "📱 Your app will be live at: https://your-app-name.onrender.com" 