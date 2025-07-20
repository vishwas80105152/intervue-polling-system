import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import WelcomeScreen from './components/WelcomeScreen';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentSetup from './components/StudentSetup';
import KickedOutScreen from './components/KickedOutScreen';
import './App.css';

// Use environment variable for server URL or default to localhost
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentView, setCurrentView] = useState('welcome');
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [activePoll, setActivePoll] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [pollHistory, setPollHistory] = useState([]);
  const [tabId, setTabId] = useState('');

  // Generate unique tab ID on component mount
  useEffect(() => {
    let storedTabId = localStorage.getItem('tabId');
    if (!storedTabId) {
      storedTabId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tabId', storedTabId);
    }
    setTabId(storedTabId);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL);
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
      setCurrentView(userRole === 'student' ? 'student-dashboard' : 'teacher-dashboard');
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
      setCurrentView('kicked-out');
    });

    socket.on('error', (errorMessage) => {
      // setError(errorMessage); // This line was removed from the new_code, so it's removed here.
      setTimeout(() => {
        // setError(''); // This line was removed from the new_code, so it's removed here.
      }, 5000);
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
    if (userRole === 'teacher' || userRole === 'student') {
      fetch('/api/poll-history')
        .then(res => res.json())
        .then(data => setPollHistory(data))
        .catch(err => console.error('Error loading poll history:', err));
    }
  }, [userRole]);

  const handleRoleSelection = (role) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentView('teacher-dashboard');
      socket.emit('select-role', { role, tabId });
    } else {
      // Check if student name already exists for this tab
      const storedStudentName = localStorage.getItem(`intervue_student_name_${tabId}`);
      if (storedStudentName) {
        // Use existing name and go directly to student dashboard
        setUserName(storedStudentName);
        setCurrentView('student-dashboard');
        socket.emit('select-role', { role: 'student', name: storedStudentName, tabId });
      } else {
        // Show student setup to get name
        setCurrentView('student-setup');
      }
    }
  };

  const handleStudentSetup = (name) => {
    setUserName(name);
    // Store student name for this specific tab
    localStorage.setItem(`intervue_student_name_${tabId}`, name);
    setCurrentView('student-dashboard');
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

  const handleChangeName = () => {
    // Clear the stored name and go back to student setup
    localStorage.removeItem(`intervue_student_name_${tabId}`);
    setUserName('');
    setCurrentView('student-setup');
  };

  const renderScreen = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onRoleSelect={handleRoleSelection} />;
      
      case 'student-setup':
        return <StudentSetup onSubmit={handleStudentSetup} isReturning={!!userName} />;
      
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
            onChangeName={handleChangeName}
            pollHistory={pollHistory}
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
      {/* {error && ( // This line was removed from the new_code, so it's removed here.
        <div className="error-toast">
          {error}
        </div>
      )} */}
      {renderScreen()}
    </div>
  );
}

export default App; 