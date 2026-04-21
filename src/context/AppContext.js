import React, { createContext, useState, useContext } from 'react';
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [sourceAyah, setSourceAyah] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return <AppContext.Provider value={{ sourceAyah, setSourceAyah, results, setResults, selectedResult, setSelectedResult, isLoading, setIsLoading }}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);