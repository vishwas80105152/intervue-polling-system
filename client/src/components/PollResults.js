import React from 'react';
import './PollResults.css';

const PollResults = ({ poll, participants, onAskNewQuestion }) => {
  if (!poll) return null;

  const totalAnswers = Object.values(poll.results).reduce((sum, count) => sum + count, 0);
  const calculatePercentage = (count) => {
    if (totalAnswers === 0) return 0;
    return Math.round((count / totalAnswers) * 100);
  };

  return (
    <div className="poll-results">
      <div className="question-display">{poll.question}</div>
      <div className="results-container">
        {poll.options.map((option, index) => {
          const votes = poll.results[index] || 0;
          const percentage = calculatePercentage(votes);
          return (
            <div className="result-option" key={index}>
              <div className="option-number">{index + 1}</div>
              <div className="option-text">{option}</div>
              <div className="result-bar-container">
                <div className="result-bar" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="percentage-text">{percentage}%</span>
            </div>
          );
        })}
      </div>
      <button className="ask-new-btn" onClick={onAskNewQuestion}>
        + Ask a new question
      </button>
    </div>
  );
};

export default PollResults; 