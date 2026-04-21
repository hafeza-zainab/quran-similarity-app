import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SimilarityPage from './pages/SimilarityPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiaryPage from './pages/DiaryPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/similarity" element={<SimilarityPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/diary" element={<DiaryPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;