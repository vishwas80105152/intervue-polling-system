# Intervue Live Polling System

A real-time live polling system built with React, Express.js, and Socket.IO. This application allows teachers to create polls and students to participate in real-time voting sessions.

## Features

### Teacher Features
- ✅ Create new polls with multiple choice questions
- ✅ Configure time limits for polls (30s, 60s, 90s, 120s)
- ✅ View live polling results in real-time
- ✅ Kick out students from the session
- ✅ View poll history (brownie points feature)
- ✅ Chat with students in real-time

### Student Features
- ✅ Enter name on first visit (unique per tab)
- ✅ Submit answers to active polls
- ✅ View live polling results after answering
- ✅ 60-second maximum time limit per question
- ✅ Chat with teachers and other students
- ✅ View participant list

### Technical Features
- ✅ Real-time communication using Socket.IO
- ✅ Responsive design for mobile and desktop
- ✅ Modern UI with gradient designs
- ✅ Tab-based unique identification
- ✅ Error handling and user feedback

## Tech Stack

- **Frontend**: React.js, CSS3
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Styling**: Custom CSS with gradients and animations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intervue
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and the React development server (port 3000).

### Manual Setup

If you prefer to set up manually:

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the servers**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm start
   ```

## Usage

### For Teachers
1. Open the application in your browser
2. Select "I'm a Teacher" role
3. Create polls with questions and multiple choice options
4. Set time limits and mark correct answers
5. Monitor live results and chat with students
6. Use the "Kick out" feature to remove disruptive students
7. View poll history to analyze past sessions

### For Students
1. Open the application in your browser
2. Select "I'm a Student" role
3. Enter your name (unique per tab)
4. Wait for the teacher to create a poll
5. Answer questions within the time limit
6. View live results after submitting
7. Chat with teachers and other students

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
├── server/                 # Express.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/poll-history` - Get poll history
- `GET /api/participants` - Get current participants

## Socket.IO Events

### Client to Server
- `select-role` - Join as teacher or student
- `create-poll` - Create a new poll (teacher only)
- `submit-answer` - Submit answer to poll (student only)
- `send-message` - Send chat message
- `kick-student` - Kick out a student (teacher only)

### Server to Client
- `current-state` - Send current app state to new user
- `new-poll` - Notify about new poll
- `poll-results-updated` - Update poll results
- `poll-ended` - Notify poll completion
- `new-message` - New chat message
- `participant-joined` - New participant joined
- `participant-updated` - Participant list updated
- `kicked-out` - Student has been kicked out
- `error` - Error message

## Deployment

### Production Build
```bash
# Build the React app
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
NODE_ENV=production
```

## Features Implemented

### Must-Haves ✅
- [x] Functional system
- [x] Teacher can ask polls
- [x] Students can answer polls
- [x] Both can view poll results
- [x] Full solution with website + backend

### Good-to-Haves ✅
- [x] Teacher can configure maximum time for polls
- [x] Teacher can kick students out
- [x] Website is properly designed

### Brownie Points ✅
- [x] Chat popup for students and teachers
- [x] Teacher can view past poll results (not from localStorage)

## Design Features

- **Color Scheme**: Purple gradient theme (#4F0DCE, #5767D0, #7765DA)
- **Typography**: Inter font family
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach
- **Accessibility**: Proper contrast ratios and keyboard navigation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 