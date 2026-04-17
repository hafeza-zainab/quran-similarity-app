import React, { useState, useEffect } from 'react';
import { fetchSurahs, fetchAyahs, fetchSimilarities } from '../services/api';
import { useAppContext } from '../context/AppContext';
import MARHALA_MAP from '../utils/marhalaMapper';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const { setSourceAyah, setResults, setIsLoading } = useAppContext();
  const [surahs, setSurahs] = useState([]);
  const [ayahs, setAyahs] = useState([]);
  
  const [selectedSurah, setSelectedSurah] = useState('');
  const [ayahInput, setAyahInput] = useState('');
  
  const [marhala, setMarhala] = useState('');
  const [juzz, setJuzz] = useState([]);

  useEffect(() => {
    fetchSurahs().then(data => setSurahs(data));
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      fetchAyahs(selectedSurah).then(data => setAyahs(data));
      setAyahInput(''); // Reset ayah search when surah changes
    } else {
      setAyahs([]);
    }
  }, [selectedSurah]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const surahNum = parseInt(selectedSurah);
    const ayahNum = parseInt(ayahInput);
    
    if (!surahNum || !ayahNum) return;
    setIsLoading(true);
    
    const juzzString = juzz.join(',');
    const data = await fetchSimilarities(surahNum, ayahNum, marhala, juzzString);
    
    setSourceAyah(data.source);
    setResults(data.results);
    setIsLoading(false);
  };

  const handleMarhalaChange = (e) => {
    const val = e.target.value;
    setMarhala(val);
    setJuzz([]);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        
        {/* STANDARD DROPDOWN FOR SURAH (Always shows all 114) */}
        <select 
          value={selectedSurah} 
          onChange={(e) => setSelectedSurah(e.target.value)}
          className="surah-select"
        >
          <option value="">Select Surah</option>
          {surahs.map(s => (
            <option key={s.surah} value={s.surah}>
              {s.surah} - {s.name}
            </option>
          ))}
        </select>

        {/* SEARCHABLE INPUT FOR AYAH (Good for long surahs) */}
        <div className="searchable-wrapper">
          <input 
            type="text" 
            list="ayah-list"
            placeholder="Type Ayah number..."
            value={ayahInput}
            onChange={(e) => setAyahInput(e.target.value)}
            disabled={ayahs.length === 0}
            required
          />
          <datalist id="ayah-list">
            {ayahs.map(a => (
              <option key={a.ayah} value={a.ayah} />
            ))}
          </datalist>
        </div>

        <button type="submit" disabled={!selectedSurah || !ayahInput}>Find Similarities</button>
      </form>

      <div className="filters">
        <select value={marhala} onChange={handleMarhalaChange}>
          <option value="">Full Quran</option>
          {Object.keys(MARHALA_MAP).map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {marhala && (
          <select multiple value={juzz} onChange={(e) => setJuzz(Array.from(e.target.selectedOptions, o => o.value))}>
            {MARHALA_MAP[marhala].map(j => <option key={j} value={j}>Juzz {j}</option>)}
          </select>
        )}
      </div>
    </div>
  );
};

export default SearchBar;