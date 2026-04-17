import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import AyahDisplay from '../components/AyahDisplay';
import SimilarityList from '../components/SimilarityList';
import SidePanel from '../components/SidePanel';

const Home = () => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="dashboard-container">
        <SearchBar />
        
        <div className="dashboard-grid">
          {/* Left Column: Main Content */}
          <div className="main-content">
            <AyahDisplay />
            <SimilarityList />
          </div>

          {/* Right Column: Widget Panel */}
          <div className="widget-panel">
            <SidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;