import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchAyahContext } from '../services/similarityApi';
import '../styles/SidePanel.css';

const SidePanel = () => {
  const { selectedResult } = useAppContext();
  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(false);

  useEffect(() => {
    if (selectedResult) {
      loadContext(selectedResult.target_surah, selectedResult.target_ayah);
    } else {
      setContext(null);
    }
  }, [selectedResult]);

  const loadContext = async (surah, ayah) => {
    setLoadingContext(true);
    try {
      const res = await fetchAyahContext(surah, ayah);
      if (res.success) setContext(res.data);
    } catch (err) {
      console.error("Failed to load context");
    } finally {
      setLoadingContext(false);
    }
  };

  if (!selectedResult) return <div className="side-panel-empty">Click a result card to view memory tips here</div>;

  return (
    <div className="side-panel">
      <div className="panel-header">Memory Tips & Context</div>
      <div className="panel-body">
        
        {/* Context Ayahs Block */}
        <div className="context-container">
          {loadingContext ? (
            <div className="loading-text">Loading context...</div>
          ) : context ? (
            <>
              {context.prev && (
                <div className="context-ayah prev">
                  <div className="context-label">Previous Ayah</div>
                  <div className="arabic-text-sm" dir="rtl">{context.prev}</div>
                </div>
              )}
              
              <div className="context-ayah main">
                <div className="context-label">Selected Ayah (Surah {selectedResult.target_surah}:{selectedResult.target_ayah})</div>
                <div className="arabic-text-sm main-text" dir="rtl">{context.current}</div>
              </div>

              {context.next && (
                <div className="context-ayah next">
                  <div className="context-label">Next Ayah</div>
                  <div className="arabic-text-sm" dir="rtl">{context.next}</div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Info Box */}
        <div className="tip-context">
          <strong>Match Analysis</strong>
          <p className="highlight-mode">Highlight Mode: <span>{selectedResult.highlight_mode}</span></p>
          <p>Similarity Score: <span>{Math.round(selectedResult.similarity_score * 100)}%</span></p>
        </div>

        {/* Tips Section - ONLY SHOW IF SCORE IS 50% OR HIGHER */}
        {selectedResult.similarity_score >= 0.5 && (
            <div className="tips-list">
              <h4>Tips:</h4>
              {selectedResult.tips && selectedResult.tips.length > 0 ? (
                <ul>{selectedResult.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
              ) : <p>No tips available for this pair yet.</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;