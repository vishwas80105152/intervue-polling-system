import React, { useState, useEffect } from 'react';
import StudentPollView from './StudentPollView';
import StudentWaitingView from './StudentWaitingView';
import ChatPanel from './ChatPanel';
import ParticipantsPanel from './ParticipantsPanel';
import PollHistory from './PollHistory';
import './StudentDashboard.css';

const StudentDashboard = ({ 
  socket, 
  activePoll, 
  participants, 
  chatMessages, 
  userName,
  onSendMessage,
  onChangeName,
  pollHistory 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Timer for active poll
  useEffect(() => {
    if (!activePoll || activePoll.status !== 'active') {
      setTimeLeft(0);
      return;
    }

    const endTime = new Date(activePoll.createdAt).getTime() + (activePoll.maxTime * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activePoll]);

  // Reset answer state when new poll starts
  useEffect(() => {
    if (activePoll && activePoll.status === 'active') {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [activePoll]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null && socket && activePoll) {
      socket.emit('submit-answer', {
        pollId: activePoll.id,
        optionIndex: selectedAnswer
      });
      setHasAnswered(true);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    if (!hasAnswered && activePoll?.status === 'active') {
      setSelectedAnswer(optionIndex);
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="brand-badge">
          <span className="brand-icon">📢</span>
          <span className="brand-text">Intervue Poll</span>
        </div>
        
        <div className="user-info">
          <span className="user-name">Welcome, {userName}!</span>
          <button 
            className="change-name-btn"
            onClick={onChangeName}
            title="Change your name"
          >
            ✏️
          </button>
        </div>
        
        <div className="header-actions">
          <button 
            className="history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="btn-icon">👁️</span>
            View Poll History
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          {!activePoll ? (
            <StudentWaitingView />
          ) : (
            <StudentPollView
              poll={activePoll}
              selectedAnswer={selectedAnswer}
              hasAnswered={hasAnswered}
              timeLeft={timeLeft}
              onAnswerSelect={handleAnswerSelect}
              onAnswerSubmit={handleAnswerSubmit}
              formatTime={formatTime}
            />
          )}
        </div>

        {/* Sidebar Panels */}
        <div className="sidebar">
          <div className="panel-tabs">
            <button 
              className={`tab-btn ${showChat ? 'active' : ''}`}
              onClick={() => {
                setShowChat(true);
                setShowParticipants(false);
              }}
            >
              Chat
            </button>
            <button 
              className={`tab-btn ${showParticipants ? 'active' : ''}`}
              onClick={() => {
                setShowParticipants(true);
                setShowChat(false);
              }}
            >
              Participants
            </button>
          </div>

          {showChat && (
            <ChatPanel 
              messages={chatMessages}
              onSendMessage={onSendMessage}
              onClose={() => setShowChat(false)}
            />
          )}

          {showParticipants && (
            <ParticipantsPanel 
              participants={participants}
              onClose={() => setShowParticipants(false)}
            />
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <button 
        className="floating-chat-btn"
        onClick={() => setShowChat(!showChat)}
      >
        <span className="chat-icon">💬</span>
      </button>

      {/* Full Page Poll History */}
      {showHistory && (
        <div className="full-page-overlay">
          <PollHistory 
            history={pollHistory}
            onClose={() => setShowHistory(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 