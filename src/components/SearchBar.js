import React, { useState, useEffect } from 'react';
import { fetchSurahs, fetchAyahs, fetchSimilarities } from '../services/similarityApi';
import { useAppContext } from '../context/AppContext';
import MARHALA_MAP from '../utils/marhalaMapper';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const { setSourceAyah, setResults, setIsLoading } = useAppContext();
  const [surahs, setSurahs] = useState([]);
  const [ayahs, setAyahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  const [ayahInput, setAyahInput] = useState('');
  const [inputError, setInputError] = useState(''); // NEW: State for UI errors
  const [marhala, setMarhala] = useState('');
  const [juzz, setJuzz] = useState([]);

  useEffect(() => { fetchSurahs().then(data => setSurahs(data)); }, []);
  
  useEffect(() => {
    if (selectedSurah) { 
      fetchAyahs(selectedSurah).then(data => setAyahs(data)); 
      setAyahInput(''); 
      setInputError(''); // Clear error when surah changes
    }
    else { setAyahs([]); }
  }, [selectedSurah]);

  // NEW: Block any non-numeric key presses in the Ayah input
  const handleAyahKeyPress = (e) => {
    const allowedChars = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (!allowedChars.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setInputError(''); // Clear previous errors

    const surahNum = parseInt(selectedSurah); 
    const ayahNum = parseInt(ayahInput);
    
    if (!surahNum || !ayahNum) {
      setInputError("Please select a Surah and enter an Ayah number.");
      return;
    }

    // NEW: Check for maximum ayah limit
    const maxAyah = ayahs.length > 0 ? ayahs[ayahs.length - 1].ayah : 0;
    if (ayahNum > maxAyah) {
      setInputError(`Surah ${selectedSurah} only has ${maxAyah} Ayahs. You entered ${ayahNum}.`);
      return;
    }

    // NEW: Check if ayah is less than 1
    if (ayahNum < 1) {
      setInputError("Ayah number must be 1 or greater.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchSimilarities(surahNum, ayahNum, marhala, juzz.join(','));
      if (res.success) {
        setSourceAyah(res.data.source);
        setResults(res.data.results);
        
        // NEW: If API returns no results, show a friendly message instead of empty screen
        if (res.data.results.length === 0) {
          setInputError(`No similarities found for Surah ${selectedSurah}, Ayah ${ayahNum}.`);
        }
      } else {
        setInputError("Failed to fetch: " + res.message);
      }
    } catch (err) {
      setInputError("Network error. Is the backend server running?");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMarhalaChange = (e) => { setMarhala(e.target.value); setJuzz([]); };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        
        {/* SURAH DROPDOWN (Already perfectly safe) */}
        <select value={selectedSurah} onChange={(e) => setSelectedSurah(e.target.value)} className="surah-select">
          <option value="">Select Surah</option>
          {surahs.map(s => <option key={s.surah} value={s.surah}>{s.surah} - {s.name}</option>)}
        </select>

        {/* AYAH INPUT (Now hardened) */}
        <div className="searchable-wrapper">
          <input 
            type="text" 
            list="ayah-list"
            placeholder="Type Ayah number..."
            value={ayahInput}
            onChange={(e) => {
              setAyahInput(e.target.value);
              setInputError(''); // Clear error as they type
            }}
            onKeyDown={handleAyahKeyPress} // Block letters/special chars
            disabled={ayahs.length === 0}
            required
            style={inputError ? { borderColor: '#DC2626' } : {}} // Turn border red if error
          />
          <datalist id="ayah-list">{ayahs.map(a => <option key={a.ayah} value={a.ayah} />)}</datalist>
        </div>

        <button type="submit" disabled={!selectedSurah || !ayahInput}>Find Similarities</button>
      </form>

      {/* NEW: Beautiful UI Error Display */}
      {inputError && (
        <div className="ui-error-message">
          ⚠️ {inputError}
        </div>
      )}

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