import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/SimilarityList.css';
const SimilarityList = () => {
  const { results, setSelectedResult, selectedResult } = useAppContext();

  if (results.length === 0) {
    return <div className="no-results">No similarities found for selected filters.</div>;
  }

  return (
    <div className="results-list">
      {results.map((r, index) => (
                        <div 
          key={`${r.target_surah}-${r.target_ayah}`}
          className={`result-card ${selectedResult?.target_surah === r.target_surah && selectedResult?.target_ayah === r.target_ayah ? 'active' : ''}`}
          onClick={() => setSelectedResult(r)}
        >
          <div className="result-top">
            {/* CHANGED THIS LINE to include r.name */}
            <span>Surah {r.target_surah} ({r.name}), Ayah {r.target_ayah}</span>
            <span className={`badge badge-${r.strength_label.toLowerCase()}`}>
              {Math.round(r.similarity_score * 100)}% - {r.strength_label}
            </span>
          </div>
          <div className="result-body">
            <div className="card-text" dir="rtl">{r.text}</div>
          </div>
          <div className="result-bottom">Juzz: {r.juzz} | Mode: {r.highlight_mode}</div>
        </div>
      ))}
    </div>
  );
};

export default SimilarityList;