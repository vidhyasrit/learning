import React, { useState } from 'react';

export default function Navbar({ page, navigate, enrolledCount, onSearch, searchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => navigate('home')}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">LearnAI</span>
        </button>
        <div className="nav-links desktop">
          {['home','courses','dashboard'].map(p => (
            <button key={p} className={`nav-link ${page===p?'active':''}`} onClick={() => navigate(p)}>
              {p==='home'?'🏠 Home':p==='courses'?'📚 Courses':`🎯 Dashboard${enrolledCount?` (${enrolledCount})`:''}`}
            </button>
          ))}
        </div>
        <div className="nav-search">
          <input type="text" placeholder="Search courses..." value={searchQuery}
            onChange={e => { onSearch(e.target.value); navigate('courses'); }}
            className="nav-search-input" />
          <span className="search-icon">🔍</span>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen?'✕':'☰'}</button>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          {['home','courses','dashboard'].map(p => (
            <button key={p} className="mobile-nav-link" onClick={() => { navigate(p); setMenuOpen(false); }}>
              {p==='home'?'🏠 Home':p==='courses'?'📚 Courses':'🎯 Dashboard'}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
