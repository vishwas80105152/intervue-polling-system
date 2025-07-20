import React, { useState } from 'react';
import './PollCreator.css';

const PollCreator = ({ socket, canCreate, pollStatus }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState([false, false, false, false]);
  const [maxTime, setMaxTime] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
      setCorrectAnswers([...correctAnswers, false]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      const newCorrectAnswers = correctAnswers.filter((_, i) => i !== index);
      setOptions(newOptions);
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }

    const correctAnswerIndex = correctAnswers.findIndex(answer => answer === true);
    if (correctAnswerIndex === -1) {
      alert('Please select the correct answer');
      return;
    }

    setIsSubmitting(true);

    const pollData = {
      question: question.trim(),
      options: validOptions,
      correctAnswer: correctAnswerIndex,
      maxTime: maxTime
    };

    socket.emit('create-poll', pollData);
  };

  if (!canCreate) {
    return (
      <div className="poll-creator">
        <div className="waiting-message">
          <div className="loading-spinner"></div>
          <h2>Please wait for the current poll to complete</h2>
          {pollStatus && pollStatus.activePoll && (
            <div className="poll-status-info">
              <p><strong>Current Status:</strong></p>
              <p>• {pollStatus.answeredStudents}/{pollStatus.totalStudents} students have answered</p>
              <p>• {pollStatus.totalStudents - pollStatus.answeredStudents} students still need to answer</p>
              {pollStatus.studentNames && pollStatus.studentNames.length > 0 && (
                <div className="answered-students">
                  <p><strong>Students who answered:</strong></p>
                  <div className="student-name-list">
                    {pollStatus.studentNames.map((name, index) => (
                      <span key={index} className="student-name-tag">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              <p>• You can create a new poll once all students answer or the time runs out</p>
            </div>
          )}
          {!pollStatus && (
            <p>You can create a new poll once all students have answered or the time runs out.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="poll-creator">
      <div className="creator-header">
        <div className="brand-badge">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">Intervue Poll</span>
        </div>
        <h1 className="main-title">Let's Get Started</h1>
        <p className="instructions">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="poll-form">
        {/* Question Input */}
        <div className="form-group">
          <div className="question-header" style={{background: 'transparent', padding: 0, borderRadius: 0}}>
            <label className="form-label">Enter your question</label>
            <div className="time-selector">
              <select
                value={maxTime}
                onChange={(e) => setMaxTime(parseInt(e.target.value))}
                className="time-select"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>
          </div>
          <div className="question-input-container">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="question-input"
              maxLength={100}
              required
            />
            <div className="char-counter">
              {question.length}/100
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="form-group">
          <div className="options-header">
            <label className="form-label">Edit Options</label>
            <label className="form-label">Is it Correct?</label>
          </div>
          
          <div className="options-container">
            {options.map((option, index) => (
              <div key={index} className="option-row">
                <div className="option-input-group">
                  <div className="option-number">{index + 1}</div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="option-input"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="remove-option-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <div className="correct-answer-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`correctAnswer-${index}`}
                      checked={correctAnswers[index] === true}
                      onChange={() => {
                        // When "Yes" is selected, clear all other "Yes" selections
                        const newCorrectAnswers = correctAnswers.map(() => false);
                        newCorrectAnswers[index] = true;
                        setCorrectAnswers(newCorrectAnswers);
                      }}
                      className="radio-input"
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`correctAnswer-${index}`}
                      checked={correctAnswers[index] === false}
                      onChange={() => {
                        // When "No" is selected, just set this option to false
                        const newCorrectAnswers = [...correctAnswers];
                        newCorrectAnswers[index] = false;
                        setCorrectAnswers(newCorrectAnswers);
                      }}
                      className="radio-input"
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
            >
              <span className="btn-icon">+</span>
              Add More option
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Poll...' : 'Ask Question'}
        </button>
      </form>
    </div>
  );
};

export default PollCreator; 