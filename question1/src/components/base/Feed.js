import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import '../style/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const users = Object.entries(data.users).map(([id, name]) => ({ id, name }));

        const allPosts = [];
        await Promise.all(
          users.map(async (user) => {
            const postsResponse = await fetch(`${apiBaseUrl}/users/${user.id}/posts`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!postsResponse.ok) throw new Error('Failed to fetch posts');
            const postsData = await postsResponse.json();
            allPosts.push(...postsData.posts);
          })
        );

        allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(allPosts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, accessToken]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="feed">
      <h2>Live Feed</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;