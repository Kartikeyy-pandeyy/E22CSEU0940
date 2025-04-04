import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import Feed from './components/Feed';

function App() {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
    },
    nav: {
      backgroundColor: '#007bff',
      padding: '1rem',
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      gap: '1rem',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
    },
    navLinkActive: {
      color: '#cce5ff',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
    }
  };

  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              Top Users
            </NavLink>
            <NavLink 
              to="/trending" 
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              Trending Posts
            </NavLink>
            <NavLink 
              to="/feed" 
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              Feed
            </NavLink>
          </div>
        </nav>
        
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;