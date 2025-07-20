import React from 'react';
import './KickedOutScreen.css';

const KickedOutScreen = () => {
  return (
    <div className="kicked-out-screen">
      <div className="kicked-out-container">
        {/* Branding */}
        <div className="branding">
          <div className="brand-badge">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">Intervue Poll</span>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="main-title">
          You've been Kicked out!
        </h1>

        {/* Explanation */}
        <p className="explanation">
          Looks like the teacher had removed you from the poll system. Please Try again sometime.
        </p>

        {/* Action Button */}
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default KickedOutScreen; 