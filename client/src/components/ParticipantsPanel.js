import React from 'react';
import './ParticipantsPanel.css';

const ParticipantsPanel = ({ participants, onKickStudent, onClose }) => {
  const students = participants.filter(p => p.role === 'student');

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="participants-panel">
      <div className="panel-header">
        <h3 className="panel-title">Participants</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="participants-container">
        {/* Students Section */}
        <div className="participants-section">
          <h4 className="section-title">
            <span className="section-icon">👨‍🎓</span>
            Students ({students.length})
          </h4>
          <div className="participants-list">
            {students.length === 0 ? (
              <div className="empty-participants">
                <span className="empty-icon">👥</span>
                <p>No students joined yet</p>
              </div>
            ) : (
              students.map((student, index) => (
                <div key={index} className="participant-item student">
                  <div className="participant-info">
                    <span className="participant-name">{student.name}</span>
                    <span className="join-time">Joined {formatTime(student.joinedAt)}</span>
                  </div>
                  {onKickStudent && (
                    <button 
                      className="kick-btn"
                      onClick={() => onKickStudent(student.tabId)}
                      title="Kick out student"
                    >
                      Kick out
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="participants-summary">
          <div className="summary-item">
            <span className="summary-label">Total Students:</span>
            <span className="summary-value">{students.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPanel; 