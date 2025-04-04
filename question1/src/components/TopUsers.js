import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      marginBottom: '1rem',
    },
    image: {
      borderRadius: '50%',
      width: '50px',
      height: '50px',
    },
    userName: {
      fontWeight: '600',
    },
    postCount: {
      color: '#666',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
    }
  };

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users).map(([id, name]) => ({
          id,
          name,
          postCount: 0
        }));

        const userPostPromises = users.map(async (user) => {
          const postsResponse = await getUserPosts(user.id);
          return { ...user, postCount: postsResponse.data.posts.length };
        });

        const usersWithPosts = await Promise.all(userPostPromises);
        const sortedUsers = usersWithPosts.sort((a, b) => b.postCount - a.postCount);
        setTopUsers(sortedUsers.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Top 5 Users by Post Count</h2>
      <div>
        {topUsers.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <img 
              src={`https://picsum.photos/50?random=${user.id}`} 
              alt={user.name} 
              style={styles.image}
            />
            <div>
              <h3 style={styles.userName}>{user.name}</h3>
              <p style={styles.postCount}>Posts: {user.postCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;