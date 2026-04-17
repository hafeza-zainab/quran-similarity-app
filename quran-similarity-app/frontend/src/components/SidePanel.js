import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/SidePanel.css';
const SidePanel = () => {
  const { selectedResult } = useAppContext();

    if (!selectedResult) {
    return <div className="side-panel-empty">Click a result card to view memory tips here</div>;
  }

  return (
    <div className="side-panel">
      <div className="panel-header">Memory Tips & Context</div>
      <div className="panel-body">
        <div className="tip-context">
          <strong>Surah {selectedResult.target_surah}:{selectedResult.target_ayah}</strong>
          <p className="highlight-mode">Highlight Mode: <span>{selectedResult.highlight_mode}</span></p>
        </div>
        
        <div className="tips-list">
          <h4>Analysis:</h4>
          {selectedResult.tips.length > 0 ? (
            <ul>
              {selectedResult.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p>No tips available for this pair yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;