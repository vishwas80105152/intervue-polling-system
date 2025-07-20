# 🚀 Deployment Guide for Intervue Polling App

## Quick Deploy Options

### Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `client/build`

### Option 2: Netlify (Free)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `cd client && npm run build`
   - Set publish directory: `client/build`

### Option 3: Railway (Full-Stack - Free Tier)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

### Option 4: Render (Full-Stack - Free Tier)

1. **Go to [render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect your GitHub repository**
4. **Set build command:** `npm run install-all && npm run build`
5. **Set start command:** `npm start`

## Environment Variables

Set these environment variables in your deployment platform:

```env
NODE_ENV=production
PORT=5001
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

## Manual Deployment Steps

### 1. Prepare Your App

```bash
# Install dependencies
npm run install-all

# Build the client
npm run build

# Test locally
npm start
```

### 2. Choose Your Platform

#### For Static Hosting (Frontend Only):
- **Vercel** - Best for React apps
- **Netlify** - Great for static sites
- **GitHub Pages** - Free hosting

#### For Full-Stack (Frontend + Backend):
- **Railway** - Easy deployment
- **Render** - Good free tier
- **Heroku** - Traditional choice
- **DigitalOcean** - More control

### 3. Database Considerations

Currently, the app uses in-memory storage. For production:

1. **Add a database** (MongoDB, PostgreSQL)
2. **Update server code** to use database
3. **Add environment variables** for database connection

### 4. SSL/HTTPS

Most platforms provide SSL automatically. For custom domains:
- **Cloudflare** - Free SSL
- **Let's Encrypt** - Free certificates

## Troubleshooting

### Common Issues:

1. **Socket.IO not connecting:**
   - Check CORS settings
   - Verify environment variables
   - Ensure WebSocket support

2. **Build failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

3. **Environment variables:**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Restart deployment after changes

## Performance Optimization

1. **Enable compression** in your server
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Optimize images** and assets

## Monitoring

1. **Add logging** to track errors
2. **Set up monitoring** (UptimeRobot, Pingdom)
3. **Configure alerts** for downtime
4. **Monitor performance** metrics

## Security Checklist

- [ ] Use HTTPS
- [ ] Set secure headers
- [ ] Validate input data
- [ ] Rate limiting
- [ ] Environment variables for secrets
- [ ] Regular dependency updates

## Support

If you encounter issues:
1. Check the platform's documentation
2. Review error logs
3. Test locally first
4. Check environment variables 