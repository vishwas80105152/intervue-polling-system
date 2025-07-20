import React, { useState, useEffect } from 'react';
import PollCreator from './PollCreator';
import PollResults from './PollResults';
import ChatPanel from './ChatPanel';
import ParticipantsPanel from './ParticipantsPanel';
import PollHistory from './PollHistory';
import './TeacherDashboard.css';

const TeacherDashboard = ({ 
  socket, 
  activePoll, 
  participants, 
  chatMessages, 
  pollHistory,
  onSendMessage, 
  onKickStudent 
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollStatus, setPollStatus] = useState(null);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check poll status when activePoll or participants change
  useEffect(() => {
    if (socket) {
      socket.emit('check-can-create-poll');
    }
  }, [activePoll, participants, socket]);

  // Listen for poll status updates
  useEffect(() => {
    if (!socket) return;

    const handlePollStatusUpdate = (status) => {
      setPollStatus(status);
    };

    socket.on('poll-status-update', handlePollStatusUpdate);

    return () => {
      socket.off('poll-status-update', handlePollStatusUpdate);
    };
  }, [socket]);

  const canCreatePoll = pollStatus ? pollStatus.canCreate : (!activePoll || activePoll.status === 'completed');

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="brand-badge">
          <span className="brand-icon">⭐</span>
          <span className="brand-text">Intervue Poll</span>
        </div>
        
        <div className="header-actions">
          <button 
            className="history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="btn-icon">👁️</span>
            View Poll history
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          {!activePoll && (
            <PollCreator 
              socket={socket} 
              canCreate={canCreatePoll}
              pollStatus={pollStatus}
            />
          )}

          {activePoll && (
            <div className="active-poll-section">
              <div className="poll-header">
                <h2>Question {activePoll.questionNumber || 1}</h2>
                {activePoll.status === 'active' && (
                  <div className="timer">
                    <span className="timer-icon">⏰</span>
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              <PollResults 
                poll={activePoll}
                participants={participants}
                onAskNewQuestion={() => {
                  socket.emit('clear-active-poll');
                }}
              />
            </div>
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
              onKickStudent={onKickStudent}
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

export default TeacherDashboard; 