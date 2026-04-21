import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/AyahDisplay.css';

const AyahDisplay = () => {
  const { sourceAyah, isLoading } = useAppContext();
  if (isLoading) return <div className="loading">Searching...</div>;
  if (!sourceAyah) return <div className="placeholder">Select an Ayah to begin</div>;

  return (
    <div className="source-ayah-card">
      <div className="card-header-banner">
        Source Ayah
        <span>Juzz {sourceAyah.juzz} | {sourceAyah.marhala}</span>
      </div>
      <div className="card-body">
        <div className="arabic-text" dir="rtl">{sourceAyah.text}</div>
      </div>
    </div>
  );
};
export default AyahDisplay;