import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import WelcomeScreen from './components/WelcomeScreen';
import StudentSetup from './components/StudentSetup';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import KickedOutScreen from './components/KickedOutScreen';
import './App.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [tabId, setTabId] = useState('');
  const [activePoll, setActivePoll] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [pollHistory, setPollHistory] = useState([]);
  const [error, setError] = useState('');

  // Generate unique tab ID
  useEffect(() => {
    const storedTabId = localStorage.getItem('intervue_tab_id');
    if (storedTabId) {
      setTabId(storedTabId);
    } else {
      const newTabId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('intervue_tab_id', newTabId);
      setTabId(newTabId);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('current-state', (data) => {
      setActivePoll(data.activePoll);
      setParticipants(data.participants);
      setChatMessages(data.chatMessages);
    });

    socket.on('new-poll', (poll) => {
      setActivePoll(poll);
      setCurrentScreen(userRole === 'student' ? 'student-dashboard' : 'teacher-dashboard');
    });

    socket.on('poll-results-updated', (data) => {
      setActivePoll(prev => prev ? { ...prev, results: data.results } : null);
    });

    socket.on('poll-ended', (poll) => {
      setActivePoll(poll);
    });

    socket.on('active-poll-cleared', () => {
      setActivePoll(null);
    });

    socket.on('new-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    socket.on('participant-joined', (participant) => {
      console.log('New participant joined:', participant);
    });

    socket.on('participant-updated', (data) => {
      setParticipants(data.participants);
    });

    socket.on('kicked-out', () => {
      setCurrentScreen('kicked-out');
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      socket.off('current-state');
      socket.off('new-poll');
      socket.off('poll-results-updated');
      socket.off('poll-ended');
      socket.off('active-poll-cleared');
      socket.off('new-message');
      socket.off('participant-joined');
      socket.off('participant-updated');
      socket.off('kicked-out');
      socket.off('error');
    };
  }, [socket, userRole]);

  // Load poll history
  useEffect(() => {
    if (userRole === 'teacher') {
      fetch('/api/poll-history')
        .then(res => res.json())
        .then(data => setPollHistory(data))
        .catch(err => console.error('Error loading poll history:', err));
    }
  }, [userRole]);

  const handleRoleSelection = (role) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentScreen('teacher-dashboard');
      socket.emit('select-role', { role, tabId });
    } else {
      setCurrentScreen('student-setup');
    }
  };

  const handleStudentSetup = (name) => {
    setUserName(name);
    setCurrentScreen('student-dashboard');
    socket.emit('select-role', { role: 'student', name, tabId });
  };

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      socket.emit('send-message', { content: content.trim() });
    }
  };

  const handleKickStudent = (studentTabId) => {
    if (socket) {
      socket.emit('kick-student', studentTabId);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onRoleSelect={handleRoleSelection} />;
      
      case 'student-setup':
        return <StudentSetup onSubmit={handleStudentSetup} />;
      
      case 'teacher-dashboard':
        return (
          <TeacherDashboard
            socket={socket}
            activePoll={activePoll}
            participants={participants}
            chatMessages={chatMessages}
            pollHistory={pollHistory}
            onSendMessage={handleSendMessage}
            onKickStudent={handleKickStudent}
          />
        );
      
      case 'student-dashboard':
        return (
          <StudentDashboard
            socket={socket}
            activePoll={activePoll}
            participants={participants}
            chatMessages={chatMessages}
            userName={userName}
            onSendMessage={handleSendMessage}
          />
        );
      
      case 'kicked-out':
        return <KickedOutScreen />;
      
      default:
        return <WelcomeScreen onRoleSelect={handleRoleSelection} />;
    }
  };

  return (
    <div className="App">
      {error && (
        <div className="error-toast">
          {error}
        </div>
      )}
      {renderScreen()}
    </div>
  );
}

export default App; 