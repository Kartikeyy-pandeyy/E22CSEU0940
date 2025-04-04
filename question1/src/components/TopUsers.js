import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      width: '90%',
      maxWidth: '600px',
      margin: '0 auto',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#333',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #007bff, #00c4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '1rem',
      borderLeft: '4px solid #007bff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    image: {
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      border: '2px solid #007bff',
      padding: '2px',
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontWeight: '700',
      fontSize: '1.2rem',
      color: '#1a1a1a',
    },
    postCount: {
      color: '#666',
      fontSize: '0.95rem',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#007bff',
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
            <div style={styles.userInfo}>
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