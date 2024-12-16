import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import logo from '/images.png';
import './App.css';
import ProfCard from './Components/ProfCard.jsx';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch professors only once
  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://rmp-backend.vercel.app/api/professors');
      setProfessors(res.data);
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme); 
    fetchProfessors();
  }, []);

  // Debounced search
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredProfessors = useMemo(() => {
    return professors.filter((prof) =>
      prof.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [professors, searchTerm]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
        />
        <div className="toggle-container">
          <input
            type="checkbox"
            id="themeToggle"
            className="toggle-button"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <label htmlFor="themeToggle">Dark Mode</label>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Scrape Button */}
        <div className="scrape-container">
          <button className="scrape-button" onClick={fetchProfessors}>
            Fetch Professors
          </button>
        </div>

        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search professors..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-indicator">
            <div className="loader"></div>
            <p>Loading professors...</p>
          </div>
        )}

        {/* Professors Grid */}
        {!loading && filteredProfessors.length > 0 && (
          <div className="professors-grid">
            {filteredProfessors.map((professor) => (
              <ProfCard key={professor._id} name={professor.name} profID={professor.profID} rating={professor.rating} feedbacks={professor.feedback} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProfessors.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No professors found for "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;