import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="dashboard-navbar">
      <div className="navbar-brand">
        <span className="brand-icon">﷽</span>
        <h1>Quran Similarity Dashboard</h1>
      </div>
      <div className="navbar-links">
        <a href="/" className="active">Home</a>
        <a href="/mushaf">Mushaf</a>
        <a href="/" className="disabled-link">Flashcards (Coming Soon)</a>
      </div>
    </nav>
  );
};

export default Navbar;