import React from 'react';
import './StudentWaitingView.css';

const StudentWaitingView = () => {
  return (
    <div className="student-waiting">
      <div className="waiting-container">
        {/* Loading Animation */}
        <div className="loading-circle">
          <div className="loading-spinner"></div>
        </div>

        {/* Waiting Message */}
        <h2 className="waiting-title">
          Wait for the teacher to ask questions..
        </h2>

        {/* Instructions */}
        <p className="waiting-instructions">
          You'll be notified when a new question is available. 
          Make sure to answer within the time limit!
        </p>

        {/* Status Indicator */}
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">Connected and ready</span>
        </div>
      </div>
    </div>
  );
};

export default StudentWaitingView; 