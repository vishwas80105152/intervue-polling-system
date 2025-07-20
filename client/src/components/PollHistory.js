import React from 'react';
import './PollHistory.css';

const PollHistory = ({ history, onClose }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getMaxVotes = (results) => {
    return Math.max(...Object.values(results));
  };

  if (history.length === 0) {
    return (
      <div className="poll-history">
        <div className="history-header">
          <h3 className="history-title">View Poll History</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="empty-history">
          <span className="empty-icon">📊</span>
          <h4>No polls yet</h4>
          <p>Poll history will appear here once you create and complete polls.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-history">
      <div className="history-header">
        <h3 className="history-title">View Poll History</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="history-container">
        {history.map((poll, index) => {
          const totalAnswers = Object.values(poll.results).reduce((sum, count) => sum + count, 0);
          const maxVotes = getMaxVotes(poll.results);

          return (
            <div key={poll.id} className="history-item">
              <div className="poll-info">
                <h4 className="poll-question">Question {index + 1}</h4>
                <div className="question-header">
                  <span className="question-text">{poll.question}</span>
                </div>
              </div>

              <div className="poll-results">
                {poll.options.map((option, optionIndex) => {
                  const votes = poll.results[optionIndex] || 0;
                  const percentage = calculatePercentage(votes, totalAnswers);
                  const isHighest = votes === maxVotes && votes > 0;
                  const isCorrect = poll.correctAnswer === optionIndex;

                  return (
                    <div 
                      key={optionIndex} 
                      className={`result-item ${isHighest ? 'highest' : ''} ${isCorrect ? 'correct' : ''}`}
                    >
                      <div className="result-header">
                        <div className="option-number">{optionIndex + 1}</div>
                        <span className="option-text">{option}</span>
                        {isCorrect && <span className="correct-badge">✓</span>}
                      </div>
                      
                      <div className="result-bar-container">
                        <div 
                          className="result-bar"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: isHighest ? '#4F0DCE' : '#7765DA'
                          }}
                        ></div>
                        <span className="percentage-text">{percentage}%</span>
                      </div>
                      
                      <div className="votes-info">
                        {votes} vote{votes !== 1 ? 's' : ''} • {totalAnswers} total
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="poll-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Responses:</span>
                  <span className="summary-value">{totalAnswers}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time Limit:</span>
                  <span className="summary-value">{poll.maxTime}s</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollHistory; 