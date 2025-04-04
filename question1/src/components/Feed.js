import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      width: '90%',
      maxWidth: '800px',
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
    postCard: {
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      borderLeft: '4px solid #007bff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    image: {
      width: '100%',
      maxWidth: '300px',
      height: 'auto',
      borderRadius: '8px',
      border: '1px solid #eee',
      alignSelf: 'center',
    },
    content: {
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#1a1a1a',
      marginBottom: '0.75rem',
    },
    userId: {
      color: '#777',
      fontSize: '0.95rem',
      fontStyle: 'italic',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#007bff',
    }
  };

  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);

        let allPosts = [];
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          allPosts = allPosts.concat(postsResponse.data.posts);
        }

        setPosts(allPosts.sort((a, b) => b.id - a.id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchInitialPosts();

    const interval = setInterval(async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);
        let latestPosts = [];
        
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          latestPosts = latestPosts.concat(postsResponse.data.posts);
        }

        setPosts(prevPosts => {
          const updatedPosts = [...latestPosts, ...prevPosts];
          return updatedPosts.sort((a, b) => b.id - a.id);
        });
      } catch (error) {
        console.error('Error polling posts:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Live Feed</h2>
      <div>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <img 
              src={`https://picsum.photos/200?random=${post.id}`} 
              alt="Post" 
              style={styles.image}
            />
            <p style={styles.content}>{post.content}</p>
            <p style={styles.userId}>User ID: {post.userid}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;