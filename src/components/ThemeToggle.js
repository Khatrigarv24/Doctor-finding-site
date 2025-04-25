import React from 'react';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleDarkMode} 
        className={`theme-toggle-button ${darkMode ? 'dark' : 'light'}`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        data-testid="theme-toggle"
      >
        {darkMode ? (
          <span role="img" aria-label="Sun">☀️</span>
        ) : (
          <span role="img" aria-label="Moon">🌙</span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;