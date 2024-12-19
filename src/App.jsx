import React, { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import axios from 'axios';
import logo from '/images.png';
import './App.css';
import ProfCard from './Components/ProfCard.jsx';

export const ImageCacheContext = createContext(new Map()); // Shared cache for images

const App = () => {
  const [theme, setTheme] = useState('light');
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0); // New state for progress
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

  // Scrape professors data with a progress update
  const scrapeProfessors = async () => {
    setScraping(true);
    setProgress(0); // Reset progress on new scrape

    try {
      const res = await axios.post('https://rmp-backend.vercel.app/api/scrape');
      if (res.status === 200) {
        setProfessors(res.data);
      }

      // Simulate progress for demo
      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return oldProgress + 10; // Increase progress
        });
      }, 500);
    } catch (error) {
      console.error('Error scraping professors:', error);
    } finally {
      setScraping(false);
    }
  };

  // Load saved theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    fetchProfessors();
  }, [fetchProfessors]);

  // Debounced search input handler
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

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
    <ImageCacheContext.Provider value={new Map()}>
      <div>
        {/* Header */}
        <div className="header">
          <img src={logo} alt="Logo" className="logo" />
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
          {/* Search Input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search professors..."
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Scrape Button */}
          <div className="scrape-button-container">
            <button
              onClick={scrapeProfessors}
              disabled={scraping}
              className={`scrape-button ${scraping ? 'loading' : ''}`}
            >
              {scraping ? 'Scraping...' : 'Scrape Professors'}
            </button>
          </div>

          {/* Scraping Progress Bar */}
          {scraping && (
            <div className="scraping-progress-container">
              <div className="scraping-progress-bar" style={{ width: `${progress}%` }} />
              <div className="scraping-progress-text">{progress}%</div>
            </div>
          )}

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
                <ProfCard
                  key={professor.profID}
                  name={professor.name}
                  profID={professor.profID}
                  rating={professor.rating}
                  feedbacks={professor.feedback}
                />
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
    </ImageCacheContext.Provider>
  );
};

// Debounce function
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default App;
