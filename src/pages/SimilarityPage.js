import React from 'react';
import SearchBar from '../components/SearchBar';
import AyahDisplay from '../components/AyahDisplay';
import SimilarityList from '../components/SimilarityList';
import SidePanel from '../components/SidePanel';

const SimilarityPage = () => {
  return (
    <div className="dashboard-container">
      <SearchBar />
      <div className="dashboard-grid">
        <div className="main-content"><AyahDisplay /><SimilarityList /></div>
        <div className="widget-panel"><SidePanel /></div>
      </div>
    </div>
  );
};
export default SimilarityPage;