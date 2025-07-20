import React, { useState } from 'react';
import './StudentSetup.css';

const StudentSetup = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="student-setup fade-in">
      <div className="setup-container">
        {/* Branding */}
        <div className="branding">
          <div className="brand-badge">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">Intervue Poll</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="main-title">
          Let's Get Started
        </h1>

        {/* Instructions */}
        <p className="instructions">
          If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.
        </p>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="name-form">
          <label htmlFor="student-name" className="input-label">
            Enter your Name
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="name-input"
            required
            autoFocus
          />
          
          <button 
            type="submit" 
            className={`continue-btn ${name.trim() ? 'active' : ''}`}
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSetup; 