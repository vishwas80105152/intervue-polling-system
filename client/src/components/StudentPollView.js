import React from 'react';
import './StudentPollView.css';

const StudentPollView = ({ 
  poll, 
  selectedAnswer, 
  hasAnswered, 
  timeLeft, 
  onAnswerSelect, 
  onAnswerSubmit,
  formatTime 
}) => {
  const totalAnswers = Object.values(poll.results).reduce((sum, count) => sum + count, 0);

  const calculatePercentage = (count) => {
    if (totalAnswers === 0) return 0;
    return Math.round((count / totalAnswers) * 100);
  };

  const getMaxVotes = () => {
    return Math.max(...Object.values(poll.results));
  };

  const maxVotes = getMaxVotes();

  return (
    <div className="student-poll-view">
      {/* Poll Header */}
      <div className="poll-header">
        <h2 className="question-number">Question {poll.questionNumber || 1}</h2>
        {poll.status === 'active' && (
          <div className="timer">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="question-display">
        <h3 className="question-text">{poll.question}</h3>
      </div>

      {/* Answer Options */}
      <div className="options-container">
        {poll.options.map((option, index) => {
          const votes = poll.results[index] || 0;
          const percentage = calculatePercentage(votes);
          const isSelected = selectedAnswer === index;
          const isHighest = votes === maxVotes && votes > 0;
          const isCorrect = poll.correctAnswer === index;

          return (
            <div 
              key={index} 
              className={`option-card ${isSelected ? 'selected' : ''} ${isHighest ? 'highest' : ''} ${isCorrect && poll.status === 'completed' ? 'correct' : ''}`}
              onClick={() => onAnswerSelect(index)}
            >
              <div className="option-header">
                <div className="option-number">{index + 1}</div>
                <span className="option-text">{option}</span>
                {isCorrect && poll.status === 'completed' && <span className="correct-badge">✓</span>}
              </div>
              
              {/* Show results if poll is completed or student has answered */}
              {(poll.status === 'completed' || hasAnswered) && (
                <div className="result-bar-container">
                  <div 
                    className="result-bar"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: isHighest ? '#4F0DCE' : '#7765DA'
                    }}
                  ></div>
                  <span className="percentage-text">{percentage}% ({votes} votes)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button or Status */}
      {poll.status === 'active' && !hasAnswered && (
        <button 
          className={`submit-btn ${selectedAnswer !== null ? 'active' : ''}`}
          onClick={onAnswerSubmit}
          disabled={selectedAnswer === null}
        >
          Submit
        </button>
      )}

      {hasAnswered && poll.status === 'active' && (
        <div className="answered-status">
          <span className="status-icon">✅</span>
          <span className="status-text">Answer submitted! Waiting for others...</span>
        </div>
      )}

      {poll.status === 'completed' && (
        <div className="completed-status">
          <span className="status-text">Wait for the teacher to ask a new question.</span>
          
          {/* Show participation summary */}
          {poll.pollStats && (
            <div className="participation-summary">
              <p className="summary-text">
                Total participation: {poll.pollStats.answeredStudents} out of {poll.pollStats.totalStudents} students
              </p>
            </div>
          )}
          
          {/* Show student participants if available */}
          {poll.pollStats && poll.pollStats.studentNames && poll.pollStats.studentNames.length > 0 && (
            <div className="student-participants">
              <p className="participants-label">Students who participated:</p>
              <div className="student-names">
                {poll.pollStats.studentNames.map((name, index) => (
                  <span key={index} className="student-name-badge">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPollView; 