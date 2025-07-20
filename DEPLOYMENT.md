# 🚀 Quick Deployment Guide

## Prerequisites
- GitHub account
- Node.js and npm installed locally

## Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `intervue-polling`
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/intervue-polling.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend (Railway) - Recommended

1. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `intervue-polling` repository

3. **Configure Backend**:
   - Set **Root Directory** to: `server`
   - Click "Deploy Now"

4. **Add Environment Variables**:
   - Go to your project settings
   - Add these variables:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend-url.vercel.app (you'll update this later)
     ```

5. **Get Your Backend URL**:
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL - you'll need it for the frontend

## Step 3: Deploy Frontend (Vercel)

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import your `intervue-polling` repository

3. **Configure Frontend**:
   - Set **Root Directory** to: `client`
   - Set **Framework Preset** to: `Create React App`
   - Click "Deploy"

4. **Add Environment Variable**:
   - Go to your project settings
   - Add environment variable:
     ```
     REACT_APP_SERVER_URL=https://your-backend-url.railway.app
     ```
   - Redeploy the project

## Step 4: Update Backend CORS

1. **Go back to Railway**:
   - Update the `CLIENT_URL` environment variable with your Vercel URL
   - Redeploy the backend

## Step 5: Test Your Deployment

1. **Test the Application**:
   - Open your Vercel URL
   - Test both teacher and student functionality
   - Verify real-time polling works

## Alternative Deployment Options

### Option 2: Netlify + Render
- **Frontend**: [netlify.com](https://netlify.com)
- **Backend**: [render.com](https://render.com)
- Follow similar steps but use Netlify for frontend and Render for backend

### Option 3: Heroku (Full Stack)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Make sure `CLIENT_URL` in backend matches your frontend URL exactly
   - Include `https://` in the URL

2. **Socket.IO Connection Issues**:
   - Verify `REACT_APP_SERVER_URL` is set correctly
   - Check that backend is running and accessible

3. **Build Errors**:
   - Make sure all dependencies are installed
   - Check Node.js version (should be 16+)

### Environment Variables Summary:

**Backend (Railway/Render/Heroku)**:
```
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

**Frontend (Vercel/Netlify)**:
```
REACT_APP_SERVER_URL=https://your-backend-url.com
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs in your hosting platform
3. Verify all environment variables are set correctly
4. Open an issue on GitHub with error details

## 🎉 Success!

Once deployed, your live polling system will be accessible to anyone with the URL. Teachers and students can join from anywhere in the world! 