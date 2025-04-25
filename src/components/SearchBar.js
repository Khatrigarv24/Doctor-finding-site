import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, doctors = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Generate suggestions based on current search term
  useEffect(() => {
    if (searchTerm && doctors.length > 0) {
      const filtered = doctors
        .filter(doctor => 
          doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(doctor => doctor.name)
        .slice(0, 3); // Limit to top 3 results
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);

  // Handle input changes and update search term
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle click on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Handle form submission (to prevent page refresh)
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit} data-testid="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          data-testid="search-input"
        />
        <span className="search-icon">🔍</span>
      </form>
      
      {showSuggestions && (
        <ul className="suggestions-list" data-testid="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid={`suggestion-${index}`}
              style={{'--index': index}} // Add index as CSS variable for staggered animation
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;