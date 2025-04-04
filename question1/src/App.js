import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TopUsersPage from './pages/TopUsersPage';
import TrendingPostsPage from './pages/TrendingPostsPage';
import FeedPage from './pages/FeedPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li><Link to="/top-users">Top Users</Link></li>
            <li><Link to="/trending-posts">Trending Posts</Link></li>
            <li><Link to="/feed">Feed</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/top-users" element={<TopUsersPage />} />
          <Route path="/trending-posts" element={<TrendingPostsPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/" element={<TopUsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;