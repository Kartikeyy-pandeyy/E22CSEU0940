import React, { useState, useEffect } from 'react';
import '../style/TopUsers.css';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const users = Object.entries(data.users).map(([id, name]) => ({ id, name }));

        const userPostCounts = new Map();
        await Promise.all(
          users.map(async (user) => {
            const postsResponse = await fetch(`${apiBaseUrl}/users/${user.id}/posts`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!postsResponse.ok) throw new Error('Failed to fetch posts');
            const postsData = await postsResponse.json();
            userPostCounts.set(user, postsData.posts.length);
          })
        );

        const sortedUsers = [...userPostCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopUsers(sortedUsers.map(([user, count]) => ({ ...user, postCount: count })));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTopUsers();
  }, [apiBaseUrl, accessToken]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="top-users">
      <h2>Top Users</h2>
      <ul>
        {topUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.postCount} posts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;