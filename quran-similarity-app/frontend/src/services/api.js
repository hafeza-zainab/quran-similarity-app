const API_BASE = 'http://localhost:3000/api';

export const fetchSurahs = async () => {
  const res = await fetch(`${API_BASE}/ayah/surahs`);
  const json = await res.json();
  return json.data;
};

export const fetchAyahs = async (surah) => {
  const res = await fetch(`${API_BASE}/ayah/${surah}/ayahs`);
  const json = await res.json();
  return json.data;
};

export const fetchSimilarities = async (surah, ayah, marhala = '', juzz = '') => {
  const params = new URLSearchParams({ surah, ayah });
  if (marhala) params.append('marhala', marhala);
  if (juzz) params.append('juzz', juzz);
  
  const res = await fetch(`${API_BASE}/similarity?${params.toString()}`);
  const json = await res.json();
  return json.data;
};