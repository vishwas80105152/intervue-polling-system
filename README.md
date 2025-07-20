# Intervue - Live Polling System

A real-time polling application for teachers and students built with React, Node.js, and Socket.IO.

## Features

### Teacher Features
- ✅ Create new polls with multiple choice questions
- ✅ View live polling results in real-time
- ✅ Configure maximum time for polls (default 60 seconds)
- ✅ Kick students out of the session
- ✅ View poll history
- ✅ Chat with students

### Student Features
- ✅ Enter name once per browser tab (persisted on refresh)
- ✅ Submit answers to active polls
- ✅ View live polling results after answering
- ✅ 60-second time limit per question
- ✅ View poll history
- ✅ Chat with teachers and other students

## Technologies Used

- **Frontend**: React.js, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO
- **Real-time Communication**: Socket.IO
- **Styling**: CSS3 with modern design

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd intervue
```

2. Install dependencies:
```bash
npm run install-all
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Create new project
   - Connect your GitHub repository
   - Set the root directory to `/server`
   - Add environment variables:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend-url.vercel.app
     ```

3. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Import your GitHub repository
   - Set the root directory to `/client`
   - Add environment variable:
     ```
     REACT_APP_SERVER_URL=https://your-backend-url.railway.app
     ```

3. **Update Backend CORS**
   - Go back to Railway and update the `CLIENT_URL` environment variable with your Vercel URL

### Option 2: Netlify (Frontend) + Render (Backend)

#### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Create new Web Service
   - Connect your GitHub repository
   - Set the root directory to `/server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend-url.netlify.app
     ```

#### Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Import your GitHub repository
   - Set the root directory to `/client`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variable:
     ```
     REACT_APP_SERVER_URL=https://your-backend-url.onrender.com
     ```

### Option 3: Heroku (Full Stack)

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-app-name
   
   # Add environment variables
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   
   # Deploy
   git push heroku main
   ```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
PORT=5001
```

### Frontend (.env.production)
```
REACT_APP_SERVER_URL=https://your-backend-url.com
```

## Project Structure

```
intervue/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/poll-history` - Get poll history
- `GET /api/participants` - Get current participants
- `GET /*` - Serve React app

## Socket.IO Events

### Client to Server
- `select-role` - Select user role (teacher/student)
- `create-poll` - Create new poll (teacher only)
- `submit-answer` - Submit poll answer (student only)
- `send-message` - Send chat message
- `kick-student` - Kick student (teacher only)
- `clear-active-poll` - Clear active poll (teacher only)

### Server to Client
- `current-state` - Send current app state
- `new-poll` - New poll created
- `poll-results-updated` - Poll results updated
- `poll-ended` - Poll completed
- `participant-joined` - New participant joined
- `participant-updated` - Participant list updated
- `new-message` - New chat message
- `kicked-out` - Student kicked out
- `active-poll-cleared` - Active poll cleared

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 