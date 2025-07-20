import React, { useState } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="welcome-screen fade-in">
      <div className="welcome-container">
        {/* Branding */}
        <div className="branding">
          <div className="brand-badge">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">Intervue Poll</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="main-title">
          Welcome to the Live Polling System
        </h1>

        {/* Instructions */}
        <p className="instructions">
          Please select the role that best describes you to begin using the live polling system.
        </p>

        {/* Role Selection Cards */}
        <div className="role-cards">
          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <h3 className="role-title">I'm a Student</h3>
            <p className="role-description">
              Submit answers and view live poll results in real-time.
            </p>
          </div>

          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('teacher')}
          >
            <h3 className="role-title">I'm a Teacher</h3>
            <p className="role-description">
              Create polls, ask questions, and monitor student responses in real-time.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          className={`continue-btn ${selectedRole ? 'active' : ''}`}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen; 