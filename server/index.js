const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Store active polls, participants, and chat messages
let activePoll = null;
let participants = new Map(); // socketId -> { name, role, tabId }
let pollHistory = [];
let chatMessages = [];
let questionCounter = 0;

// Helper function to check if all students have answered
const haveAllStudentsAnswered = () => {
  if (!activePoll || activePoll.status !== 'active') return false;
  const students = Array.from(participants.values()).filter(p => p.role === 'student');
  // Only count answers from currently connected students
  const connectedStudentAnswers = Array.from(activePoll.answers.keys()).filter(socketId => 
    participants.has(socketId) && participants.get(socketId).role === 'student'
  );
  return connectedStudentAnswers.length >= students.length;
};

// Helper function to get poll statistics
const getPollStats = () => {
  if (!activePoll) return { totalStudents: 0, answeredStudents: 0, studentNames: [] };
  
  const students = Array.from(participants.values()).filter(p => p.role === 'student');
  const connectedStudentAnswers = Array.from(activePoll.answers.keys()).filter(socketId => 
    participants.has(socketId) && participants.get(socketId).role === 'student'
  );
  
  const studentNames = connectedStudentAnswers.map(socketId => {
    const participant = participants.get(socketId);
    return participant ? participant.name : 'Unknown';
  });
  
  return {
    totalStudents: students.length,
    answeredStudents: connectedStudentAnswers.length,
    studentNames
  };
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room for broadcasting
  socket.join('polling-room');

  // Handle role selection
  socket.on('select-role', (data) => {
    const { role, name, tabId } = data;
    
    console.log(`Role selected: ${role} - ${name} (${tabId})`);
    
    // Store participant info using socket.id as unique key
    participants.set(socket.id, {
      name: name || (role === 'teacher' ? 'Teacher' : 'Anonymous'),
      role,
      tabId,
      joinedAt: new Date()
    });

    console.log(`Total participants: ${participants.size}`);
    console.log(`Students: ${Array.from(participants.values()).filter(p => p.role === 'student').length}`);

    // Send current state to new participant
    socket.emit('current-state', {
      activePoll,
      participants: Array.from(participants.values()),
      chatMessages: chatMessages.slice(-50) // Last 50 messages
    });

    // Notify others about new participant
    socket.to('polling-room').emit('participant-joined', {
      name: name || (role === 'teacher' ? 'Teacher' : 'Anonymous'),
      role
    });

    // Broadcast updated participant list to all clients
    io.to('polling-room').emit('participant-updated', {
      participants: Array.from(participants.values())
    });
  });

  // Handle creating a new poll (teacher only)
  socket.on('create-poll', (pollData) => {
    const participant = participants.get(socket.id);
    if (participant && participant.role === 'teacher') {
      // Check if there's already an active poll and not all students have answered
      if (activePoll && activePoll.status === 'active' && !haveAllStudentsAnswered()) {
        const pollStats = getPollStats();
        socket.emit('error', `Cannot create new poll. ${pollStats.answeredStudents}/${pollStats.totalStudents} students have answered. Please wait for all students to answer or the time to run out.`);
        return;
      }

      questionCounter++;
      activePoll = {
        id: uuidv4(),
        questionNumber: questionCounter,
        question: pollData.question,
        options: pollData.options,
        correctAnswer: pollData.correctAnswer,
        maxTime: pollData.maxTime || 60,
        status: 'active',
        createdAt: new Date(),
        answers: new Map(),
        results: {}
      };

      // Initialize results
      pollData.options.forEach((option, index) => {
        activePoll.results[index] = 0;
      });

      // Broadcast new poll to all participants
      io.to('polling-room').emit('new-poll', activePoll);

      // Set timer to end poll
      setTimeout(() => {
        if (activePoll && activePoll.status === 'active') {
          activePoll.status = 'completed';
          const pollStats = getPollStats();
          const pollWithStats = {
            ...activePoll,
            pollStats
          };
          io.to('polling-room').emit('poll-ended', pollWithStats);
          
          // Save to history
          pollHistory.push({
            ...activePoll,
            answers: Array.from(activePoll.answers.entries()),
            participants: Array.from(participants.values()),
            pollStats
          });
        }
      }, activePoll.maxTime * 1000);
    }
  });

  // Handle student answer submission
  socket.on('submit-answer', (answerData) => {
    const participant = participants.get(socket.id);
    if (participant && participant.role === 'student' && activePoll && activePoll.status === 'active') {
      // Check if student already answered
      if (activePoll.answers.has(socket.id)) {
        socket.emit('error', 'You have already answered this question.');
        return;
      }

      // Record answer
      activePoll.answers.set(socket.id, answerData.optionIndex);
      activePoll.results[answerData.optionIndex]++;

      // Broadcast updated results
      io.to('polling-room').emit('poll-results-updated', {
        pollId: activePoll.id,
        results: activePoll.results,
        totalAnswers: activePoll.answers.size
      });

      // Check if all students have answered
      if (haveAllStudentsAnswered()) {
        activePoll.status = 'completed';
        const pollStats = getPollStats();
        const pollWithStats = {
          ...activePoll,
          pollStats
        };
        io.to('polling-room').emit('poll-ended', pollWithStats);
        
        // Save to history
        pollHistory.push({
          ...activePoll,
          answers: Array.from(activePoll.answers.entries()),
          participants: Array.from(participants.values()),
          pollStats
        });
      }
    }
  });

  // Handle chat messages
  socket.on('send-message', (messageData) => {
    const participant = participants.get(socket.id);
    if (participant) {
      const message = {
        id: uuidv4(),
        sender: participant.name,
        role: participant.role,
        content: messageData.content,
        timestamp: new Date()
      };
      
      chatMessages.push(message);
      
      // Keep only last 100 messages
      if (chatMessages.length > 100) {
        chatMessages = chatMessages.slice(-100);
      }
      
      io.to('polling-room').emit('new-message', message);
    }
  });

  // Handle kicking out a student (teacher only)
  socket.on('kick-student', (studentTabId) => {
    const participant = participants.get(socket.id);
    if (participant && participant.role === 'teacher') {
      // Find student by tabId
      for (const [socketId, p] of participants.entries()) {
        if (p.tabId === studentTabId && p.role === 'student') {
          // Kick the student
          io.to(socketId).emit('kicked-out');
          participants.delete(socketId);
          break;
        }
      }
      
      // Notify others
      io.to('polling-room').emit('participant-updated', {
        participants: Array.from(participants.values())
      });
    }
  });

  // Handle clearing active poll (teacher only)
  socket.on('clear-active-poll', () => {
    const participant = participants.get(socket.id);
    if (participant && participant.role === 'teacher') {
      // Clear the active poll
      activePoll = null;
      
      // Broadcast to all participants that poll is cleared
      io.to('polling-room').emit('active-poll-cleared');
    }
  });

  // Handle checking if teacher can create new poll
  socket.on('check-can-create-poll', () => {
    const participant = participants.get(socket.id);
    if (participant && participant.role === 'teacher') {
      const canCreate = !activePoll || activePoll.status === 'completed' || haveAllStudentsAnswered();
      const pollStats = getPollStats();
      const pollStatus = {
        canCreate,
        activePoll: activePoll ? {
          ...activePoll,
          answers: Array.from(activePoll.answers.entries())
        } : null,
        totalStudents: pollStats.totalStudents,
        answeredStudents: pollStats.answeredStudents,
        studentNames: pollStats.studentNames
      };
      socket.emit('poll-status-update', pollStatus);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    participants.delete(socket.id);
    
    // Notify others
    socket.to('polling-room').emit('participant-updated', {
      participants: Array.from(participants.values())
    });
  });
});

// API Routes
app.get('/api/poll-history', (req, res) => {
  res.json(pollHistory);
});

app.get('/api/participants', (req, res) => {
  res.json(Array.from(participants.values()));
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`Socket.IO server ready for connections`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
}); 