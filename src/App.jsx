import React, { useState, useEffect } from 'react';
import logo from '/images.png';
import './App.css';
import './Components/ProfCard.jsx';
import ProfCard from './Components/ProfCard.jsx';
import axios from 'axios';

const App = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');  

  useEffect(() => {
    try {
      fetchItems();
      console.log(professors);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchItems = async () => {
    setLoading(true); 
    try {
      const res = await axios.get('https://rmp-backend.vercel.app/api/professors');
      setProfessors(res.data);
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      const res = await axios.post('https://rmp-backend.vercel.app/api/scrape');
      alert(res.data.message);
      fetchItems();
    } catch (error) {
      console.error("Error scraping data:", error);
      alert("Error scraping professors. Please try again.");
    }
  };

  const filteredProfessors = professors.filter(prof =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='flex-container'>
        <img src={logo} alt="logo" />
        <h2>Welcome Admin</h2>
      </div>
      <div className="contents">
        <button onClick={handleScrape}>Scrape Professors</button>
      </div>
      <hr />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by professor's name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  
        />
      </div>

      {loading ? (
        <div className="loading-indicator">
          <p>Loading professors...</p>
        </div>
      ) : (
        <div className="professors-grid">
          {filteredProfessors.map((prof) => {
            return <ProfCard key={prof._id} name={prof.name} profID={prof.profID} rating={prof.rating} feedbacks={prof.feedback} />;
          })}
        </div>
      )}
    </>
  );
};

export default App;
