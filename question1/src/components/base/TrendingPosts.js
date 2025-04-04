import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import '../style/TrendingPosts.css';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const users = Object.entries(data.users).map(([id, name]) => ({ id, name }));

        const postCommentCounts = new Map();
        await Promise.all(
          users.map(async (user) => {
            const postsResponse = await fetch(`${apiBaseUrl}/users/${user.id}/posts`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!postsResponse.ok) throw new Error('Failed to fetch posts');
            const postsData = await postsResponse.json();
            await Promise.all(
              postsData.posts.map(async (post) => {
                const commentsResponse = await fetch(`${apiBaseUrl}/posts/${post.id}/comments`, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
                const commentsData = await commentsResponse.json();
                postCommentCounts.set(post, commentsData.comments.length);
              })
            );
          })
        );

        const maxComments = Math.max(...postCommentCounts.values());
        const trending = [...postCommentCounts.entries()]
          .filter(([, count]) => count === maxComments)
          .map(([post, count]) => ({ ...post, commentCount: count }));
        setTrendingPosts(trending);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrendingPosts();
  }, [apiBaseUrl, accessToken]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="trending-posts">
      <h2>Trending Posts</h2>
      {trendingPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default TrendingPosts;