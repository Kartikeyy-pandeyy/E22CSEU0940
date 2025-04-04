import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
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
    postCard: {
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      marginBottom: '1rem',
    },
    image: {
      width: '200px',
      height: '200px',
      borderRadius: '4px',
      marginBottom: '0.5rem',
    },
    content: {
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    userId: {
      color: '#666',
      fontSize: '0.875rem',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
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